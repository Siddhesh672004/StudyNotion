$ErrorActionPreference = 'Stop'

$base = 'http://localhost:4000/api/v1'
$stamp = Get-Date -Format 'yyyyMMddHHmmss'
$email = "e2e.neg.$stamp@testmail.com"
$password = 'Test@12345'

$result = [ordered]@{
    setup = [ordered]@{}
    tests = @()
}

function Add-TestResult {
    param(
        [string]$Name,
        [bool]$Passed,
        [int]$StatusCode,
        [string]$ObservedMessage,
        [string]$Expected
    )

    $script:result.tests += [ordered]@{
        name = $Name
        passed = $Passed
        statusCode = $StatusCode
        observedMessage = $ObservedMessage
        expected = $Expected
    }
}

try {
    $sendOtpResp = Invoke-RestMethod -Uri "$base/auth/sendotp" -Method Post -ContentType 'application/json' -Body (@{ email = $email } | ConvertTo-Json) -TimeoutSec 60
    $result.setup.sendOtpSuccess = $sendOtpResp.success

    $otpRaw = node .\scripts\get-latest-otp.js $email
    $otp = (($otpRaw | Out-String).Trim() -split "`r?`n")[-1].Trim()
    if (-not $otp) { throw 'OTP parse failed in setup' }

    $signupResp = Invoke-RestMethod -Uri "$base/auth/signup" -Method Post -ContentType 'application/json' -Body (@{
            firstName       = 'E2E'
            lastName        = 'Negative'
            email           = $email
            password        = $password
            confirmPassword = $password
            accountType     = 'Student'
            contactNumber   = '9999999999'
            otp             = $otp
        } | ConvertTo-Json) -TimeoutSec 60
    $result.setup.signupSuccess = $signupResp.success

    $loginResp = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email = $email; password = $password } | ConvertTo-Json) -TimeoutSec 60
    $result.setup.loginSuccess = $loginResp.success

    $token = $loginResp.token
    if (-not $token) { throw 'Token missing in setup' }

    $headers = @{ Authorization = "Bearer $token" }

    $allCoursesResp = Invoke-RestMethod -Uri "$base/course/showAllCourses" -Method Get -TimeoutSec 60
    $courseId = $allCoursesResp.data[0]._id
    if (-not $courseId) { throw 'No course available for test setup' }
    $result.setup.courseId = $courseId

    $captureResp = Invoke-RestMethod -Uri "$base/payment/capturePayment" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{ courses = @($courseId) } | ConvertTo-Json) -TimeoutSec 60
    $result.setup.captureSuccess = $captureResp.success
    $orderId = $captureResp.data.id

    $paymentId = 'pay_e2e_neg_setup'
    $signatureRaw = node .\scripts\generate-razorpay-signature.js $orderId $paymentId
    $signature = (($signatureRaw | Out-String).Trim() -split "`r?`n")[-1].Trim()

    $verifySetup = Invoke-RestMethod -Uri "$base/payment/verifyPayment" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{
            razorpay_order_id   = $orderId
            razorpay_payment_id = $paymentId
            razorpay_signature  = $signature
            courses             = @($courseId)
        } | ConvertTo-Json) -TimeoutSec 120
    $result.setup.verifySetupSuccess = $verifySetup.success

    # 1) Invalid signature
    try {
        Invoke-RestMethod -Uri "$base/payment/verifyPayment" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{
                razorpay_order_id   = $orderId
                razorpay_payment_id = 'pay_e2e_neg_invalid_sig'
                razorpay_signature  = 'invalid_signature_123'
                courses             = @($courseId)
            } | ConvertTo-Json) -TimeoutSec 120 | Out-Null

        Add-TestResult -Name 'Invalid signature rejected' -Passed $false -StatusCode 200 -ObservedMessage 'Unexpected success' -Expected 'HTTP 400 with Invalid signature'
    }
    catch {
        $status = [int]$_.Exception.Response.StatusCode
        $body = $_.ErrorDetails.Message
        $msg = ''
        if ($body) {
            try { $msg = (ConvertFrom-Json $body).message } catch { $msg = $body }
        }
        $passed = ($status -eq 400 -and $msg -eq 'Invalid signature')
        Add-TestResult -Name 'Invalid signature rejected' -Passed $passed -StatusCode $status -ObservedMessage $msg -Expected 'HTTP 400 with Invalid signature'
    }

    # 2) Missing token
    try {
        Invoke-RestMethod -Uri "$base/payment/verifyPayment" -Method Post -ContentType 'application/json' -Body (@{
                razorpay_order_id   = $orderId
                razorpay_payment_id = 'pay_e2e_neg_missing_token'
                razorpay_signature  = $signature
                courses             = @($courseId)
            } | ConvertTo-Json) -TimeoutSec 120 | Out-Null

        Add-TestResult -Name 'Missing token rejected' -Passed $false -StatusCode 200 -ObservedMessage 'Unexpected success' -Expected 'HTTP 401 with Token is missing'
    }
    catch {
        $status = [int]$_.Exception.Response.StatusCode
        $body = $_.ErrorDetails.Message
        $msg = ''
        if ($body) {
            try { $msg = (ConvertFrom-Json $body).message } catch { $msg = $body }
        }
        $passed = ($status -eq 401 -and $msg -eq 'Token is missing')
        Add-TestResult -Name 'Missing token rejected' -Passed $passed -StatusCode $status -ObservedMessage $msg -Expected 'HTTP 401 with Token is missing'
    }

    # 3) Already enrolled on capture
    try {
        $secondCapture = Invoke-RestMethod -Uri "$base/payment/capturePayment" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{ courses = @($courseId) } | ConvertTo-Json) -TimeoutSec 60
        $passed = ($secondCapture.success -eq $false -and $secondCapture.message -eq 'Student is already enrolled')
        Add-TestResult -Name 'Already enrolled blocked' -Passed $passed -StatusCode 200 -ObservedMessage $secondCapture.message -Expected 'success=false and Student is already enrolled'
    }
    catch {
        Add-TestResult -Name 'Already enrolled blocked' -Passed $false -StatusCode ([int]$_.Exception.Response.StatusCode) -ObservedMessage $_.Exception.Message -Expected 'success=false and Student is already enrolled'
    }

    $result.summary = [ordered]@{
        total = $result.tests.Count
        passed = (@($result.tests | Where-Object { $_.passed }).Count)
        failed = (@($result.tests | Where-Object { -not $_.passed }).Count)
        allPassed = (@($result.tests | Where-Object { -not $_.passed }).Count -eq 0)
    }
    $result.testUserEmail = $email
}
catch {
    $result.fatalError = $_.Exception.Message
    if ($_.ErrorDetails.Message) { $result.fatalErrorBody = $_.ErrorDetails.Message }
    $result.testUserEmail = $email
}

$result | ConvertTo-Json -Depth 8
