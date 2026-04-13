const getProgressPercentage = (completedVideosCount, totalVideosCount) => {
  if (!totalVideosCount) {
    return 0;
  }

  return Math.round((completedVideosCount / totalVideosCount) * 100);
};

module.exports = {
  getProgressPercentage,
};
