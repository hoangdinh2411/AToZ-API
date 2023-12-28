class MediaController {
  static async upload(req, res, next) {
    try {
      const files = req.files;
      console.log(files);
      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MediaController;
