
var Gallery = function () {

  return {

    init: function () {
      this.filesUpload = document.getElementById('files-upload'),
      this.dropArea = document.getElementById('drop-area'),
      this.fileList = document.getElementById('file-list');
      this.addListeners();
      return this;
    },

    getFileDesc: function (fileInfo) {
      var descElement = document.createElement('div');
      var desc = '<p>' + fileInfo.name + '</p>';
      desc += '<p>' + fileInfo.size + ' kb</p>';
      desc += '<p>' + fileInfo.type + '</p>';
      descElement.innerHTML = desc;
      return descElement;
    },

    getFileThumb: function (img) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = 150;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0, 150, 150);
      return canvas;
    },

    uploadFile: function (file) {
      var li = document.createElement('li'),
        link = document.createElement('a'),
        img, reader, that = this;

      /*
        If the file is an image and the web browser supports FileReader,
        present a preview in the file list
      */
      if (typeof FileReader !== 'undefined' && (/image/i).test(file.type)) {
        img = document.createElement('img');

        reader = new FileReader();
        reader.onload = (function (theImg) {
          return function (evt) {
            theImg.src = evt.target.result;

            var fileThumb = that.getFileThumb(img);
            link.appendChild(fileThumb);
            link.href = evt.target.result;
            link.target = '_blank';
            li.appendChild(link);
          };
        }(img));
        reader.readAsDataURL(file);
      }

      var fileDesc = this.getFileDesc({
        name: file.name,
        size: parseInt(file.size / 1024, 10),
        type: file.type
      });
      li.appendChild(fileDesc);

      this.fileList.appendChild(li);
    },

    traverseFiles: function (files) {
      if (typeof files !== 'undefined') {
        for (var i = 0, l = files.length; i < l; i++) {
          this.uploadFile(files[i]);
        }
      } else {
        this.fileList.innerHTML = 'No support for the File API in this web browser';
      }
    },

    addListeners: function (arguments) {
      var that = this;

      this.filesUpload.addEventListener('change', function (evt) {
        that.traverseFiles(this.files);
      }, false);

      this.dropArea.addEventListener('dragleave', function (evt) {
        var target = evt.target;
        
        if (target && target === this.dropArea) {
          this.className = '';
        }
        evt.preventDefault();
        evt.stopPropagation();
      }, false);
      
      this.dropArea.addEventListener('dragenter', function (evt) {
        this.className = 'over';
        evt.preventDefault();
        evt.stopPropagation();
      }, false);

      this.dropArea.addEventListener('dragover', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      }, false);

      this.dropArea.addEventListener('drop', function (evt) {
        that.traverseFiles(evt.dataTransfer.files);
        this.className = '';
        evt.preventDefault();
        evt.stopPropagation();
      }, false);
    }
  }
};
