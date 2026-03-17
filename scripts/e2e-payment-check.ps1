$ErrorActionPreference = 'Stop'

$base = 'http://localhost:4000/api/v1'
$stamp = Get-Date -Format 'yyyyMMddHHmmss'
$email = "e2e.student.$stamp@testmail.com"
$password = 'Test@12345'
$result = [ordered]@{}

try {
    $sendOtpResp = Invoke-RestMethod -Uri "$base/auth/sendotp" -Method Post -ContentType 'application/json' -Body (@{ email = $email } | ConvertTo-Json) -TimeoutSec 60
    $result.sendOtpSuccess = $sendOtpResp.success

    $otpRaw = node .\scripts\get-latest-otp.js $email

    $otp = (($otpRaw | Out-String).Trim() -split "`r?`n")[-1].Trim()
    if (-not $otp) {
        throw 'OTP parse failed'
    }
    $result.otpParsed = $true

    $signupResp = Invoke-RestMethod -Uri "$base/auth/signup" -Method Post -ContentType 'application/json' -Body (@{
            firstName       = 'E2E'
            lastName        = 'Student'
            email           = $email
            password        = $password
            confirmPassword = $password
            accountType     = 'Student'
            contactNumber   = '9999999999'
            otp             = $otp
        } | ConvertTo-Json) -TimeoutSec 60
    $result.signupSuccess = $signupResp.success

    $loginResp = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email = $email; password = $password } | ConvertTo-Json) -TimeoutSec 60
    $result.loginSuccess = $loginResp.success

    $token = $loginResp.token
    if (-not $token) {
        throw 'Login token missing'
    }

    $headers = @{ Authorization = "Bearer $token" }

    $allCoursesResp = Invoke-RestMethod -Uri "$base/course/showAllCourses" -Method Get -TimeoutSec 60
    $courseId = $allCoursesResp.data[0]._id
    if (-not $courseId) {
        throw 'No course available for capture payment test'
    }
    $result.courseSelected = $true

    $captureResp = Invoke-RestMethod -Uri "$base/payment/capturePayment" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{ courses = @($courseId) } | ConvertTo-Json) -TimeoutSec 60
    $result.captureSuccess = $captureResp.success

    $orderId = $captureResp.data.id
    if (-not $orderId) {
        throw 'Order ID missing from capture response'
    }

    $paymentId = 'pay_e2e_test_005'

    $signatureRaw = node .\scripts\generate-razorpay-signature.js $orderId $paymentId

    $signature = (($signatureRaw | Out-String).Trim() -split "`r?`n")[-1].Trim()
    if (-not $signature) {
        throw 'Signature generation failed'
    }

    $verifyResp = Invoke-RestMethod -Uri "$base/payment/verifyPayment" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{
            razorpay_order_id   = $orderId
            razorpay_payment_id = $paymentId
            razorpay_signature  = $signature
            courses             = @($courseId)
        } | ConvertTo-Json) -TimeoutSec 120
    $result.verifySuccess = $verifyResp.success

    $enrolledResp = Invoke-RestMethod -Uri "$base/profile/getEnrolledCourses" -Method Get -Headers $headers -TimeoutSec 60
    $result.enrolledCheck = (($enrolledResp.data | Where-Object { $_._id -eq $courseId } | Measure-Object).Count -gt 0)

    $result.testUserEmail = $email
    $result.testedCourseId = $courseId
}
catch {
    $result.error = $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        $result.errorBody = $_.ErrorDetails.Message
    }
    $result.testUserEmail = $email
}

$result | ConvertTo-Json -Depth 6
