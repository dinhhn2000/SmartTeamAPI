"use strict";
const response = require("../../../utils/Responses");
const models = require("../../../utils/Models");
const validators = require("../../../utils/Validations/validations");
const path = require("path");
const cloudinary = require("cloudinary").v2;

module.exports = {
  getMediaData: async (req, res, next) => {
    let { user } = req;
    let idMediaData = req.query.id;
    try {
      if (idMediaData === undefined || idMediaData === "") throw "Required id (idMediaData)";
      validators.validateId(idMediaData);

      let mediaDataInfo = await models.MediaDataModel.findOne({
        where: { idMediaData },
        raw: true,
      });
      if (!mediaDataInfo) throw "This mediaData not exist";

      // Check is in project
      await isInProject(mediaDataInfo.idTask, user.idUser);

      return response.success(res, "Get mediaData's info success", mediaDataInfo);
    } catch (e) {
      return response.error(res, "Get mediaData's info fail", e);
    }
  },
  getMediaDataList: async (req, res, next) => {
    let { user } = req;
    let idTask = req.query.id;
    try {
      if (idTask === undefined || idTask === "") throw "Required id (idTask)";
      validators.validatePagination(req.query);

      // Check is in project
      await isInProject(idTask, user.idUser);

      let mediaDataList = await models.MediaDataModel.findByIdTask(idTask, req.query);

      return response.success(res, "Get list of mediaDatas success", mediaDataList);
    } catch (e) {
      return response.error(res, "Get list of mediaDatas fail", e);
    }
  },
  createMediaData: async (req, res, next) => {
    let { user } = req;
    let { idTask } = req.body;
    // let { idTask, type } = req.body;
    try {
      validators.validateMediaDataInfo(req.body);

      // Check idProject
      await isInProject(idTask, user.idUser);

      // Create mediaData
      let uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      });
      console.log(req.file.path);
      console.log("-------------");
      console.log(path.extname(req.file.path));
      let fileType = checkFileType(path.extname(req.file.path));

      let newMediaData = await models.MediaDataModel.create({
        url: uploadResult.url,
        type: fileType,
        idTask,
      });

      return response.created(res, "Create mediaData success", newMediaData);
    } catch (e) {
      return response.error(res, "Create mediaData fail", e);
    }
  },
  removeMediaData: async (req, res, next) => {
    const { user } = req;
    const { idMediaData } = req.body;
    try {
      if (idMediaData === undefined || idMediaData === "") throw "Required idMediaData";

      // Check mediaData
      let mediaDataRecord = await models.MediaDataModel.findOne({
        where: { idMediaData },
        raw: true,
      });
      if (!mediaDataRecord) throw "MediaData not exist";

      isInProject(mediaDataRecord.idTask, user.idUser);

      let mediaUrl = mediaDataRecord.url;
      mediaUrl = mediaUrl.split("/");
      mediaUrl = mediaUrl[mediaUrl.length - 1];
      mediaUrl = mediaUrl.split(".")[0];
      let removeResult = await cloudinary.uploader.destroy(mediaUrl, {
        resource_type: mediaDataRecord.type === "image" ? "image" : "video",
      });
      // console.log(removeResult);
      if (removeResult.result !== "ok") throw "Something wrong with cloudinary";

      await models.MediaDataModel.destroy({ where: { idMediaData } });
      return response.success(res, "Remove mediaData success");
    } catch (e) {
      return response.error(res, "Remove mediaData fail", e);
    }
  },
};

async function isInProject(idTask, idUser) {
  let taskInfo = await models.TaskModel.findOne({ where: { idTask: idTask } });
  if (!taskInfo) throw "This task is not exist";
  let projectInfo = await models.ProjectUserModel.findOne({
    where: { idProject: taskInfo.idProject, idUser },
  });
  if (!projectInfo) throw "This account is not in this project";
}

const checkFileType = (extension) => {
  if (isImage(extension)) return "image";
  if (isAudio(extension)) return "audio";
  if (isVideo(extension)) return "video";
  return "others";
};

const isImage = (extension) => {
  let ext = extension.toLowerCase();
  let fileExts = [
    ".ai",
    ".gif",
    ".webp",
    ".bmp",
    ".djvu",
    ".fbx",
    ".flif",
    ".gif",
    ".gltf",
    ".ico",
    ".indd",
    ".jpg",
    ".jpe",
    ".jpeg",
    ".jp2",
    ".wdp",
    ".jxr",
    ".hdp",
    ".pdf",
    ".png",
    ".psd",
    ".arw",
    ".cr2",
    ".svg",
    ".tga",
    ".tif",
    ".tiff",
    ".webp",
  ];
  return fileExts.includes(ext);
};

const isAudio = (extension) => {
  let ext = extension.toLowerCase();
  let fileExts = [".aac", ".aiff", ".amr", ".flac", ".m4a", ".mp3", ".ogg", ".opus", ".wav"];
  return fileExts.includes(ext);
};

const isVideo = (extension) => {
  let ext = extension.toLowerCase();
  let fileExts = [
    ".3g2",
    ".3gp",
    ".avi",
    ".flv",
    ".m3u8",
    ".mov",
    ".mkv",
    ".mp4",
    ".mpeg",
    ".mpd",
    ".mxf",
    ".ogv",
    ".webm",
    ".wmv",
  ];
  return fileExts.includes(ext);
};
