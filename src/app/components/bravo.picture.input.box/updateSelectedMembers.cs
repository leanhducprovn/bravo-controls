static bool updateSelectedMembers(
    Control pControl,
    BravoLayoutData pSelectedMembers,
    string pzFullFileName,
    out Dictionary<SelectedMemberEnum, object> pValues,
    bool pbAutoDetectTextFile = true,
    long pnFileSize = -1,
    byte[] pZipContent = null,
    Image pImageContent = null,
    int pnThumbnailWidth = -1,
    int pnThumbnailHeight = -1
)
{
  pValues = null;

  if (pSelectedMembers == null || pSelectedMembers.Count < 1)
    return false;

  DataRow _dr = null;
  if (pControl != null)
  {
    var _grid = pControl.Parent as c1g.C1FlexGrid;
    if (_grid != null)
    {
      // To apply changed value in grid before updating binding members
      if (_grid.FinishEditing(false))
        _grid.StartEditing(); // restart editing grid for handling enter key to next cell
    }

    _dr = findBindingDataRow(pControl);
    if (_dr == null) return false;
  }

  var _bIsValidFileName = !string.IsNullOrEmpty(pzFullFileName) &&
      !pzFullFileName.Contains(";") && !pzFullFileName.StartsWith(".");
  bool? _bFileExists = null;
  FileInfo _fi = null;
  Image _imageTemp = null;

  try
  {
    var _bUpdated = false;
    foreach (KeyValuePair<string, BravoLayoutItem> _kp in pSelectedMembers)
    {
      if (_kp.Value == null)
        continue;

      var _s = _kp.Value._str().Split(',');
      if (_s.Length < 1) continue;

      object _value = null;
      var _e = (SelectedMemberEnum)Enum.Parse(typeof(SelectedMemberEnum), _kp.Key);

      try
      {
        switch (_e)
        {
          case SelectedMemberEnum.FileName:
            if (_bIsValidFileName)
              _value = Path.GetFileName(pzFullFileName);
            else
              _value = DBNull.Value;
            break;

          case SelectedMemberEnum.FileNameWithoutExtension:
            if (_bIsValidFileName)
              _value = Path.GetFileNameWithoutExtension(pzFullFileName);
            else
              _value = DBNull.Value;
            break;

          case SelectedMemberEnum.FileExtension:
            if (_bIsValidFileName)
              _value = Path.GetExtension(pzFullFileName).TrimStart('.');
            else
              _value = DBNull.Value;
            break;

          case SelectedMemberEnum.FileLocation:
            if (_bIsValidFileName)
              _value = Path.GetDirectoryName(pzFullFileName);
            else
              _value = DBNull.Value;
            break;

          case SelectedMemberEnum.FolderName:
            if (_bIsValidFileName)
              _value = Path.GetFileName(Path.GetDirectoryName(pzFullFileName));
            else
              _value = DBNull.Value;
            break;

          case SelectedMemberEnum.FileContent:
            if (_bIsValidFileName)
            {
              if (_bFileExists == null)
                _bFileExists = File.Exists(pzFullFileName);
              if (!_bFileExists.Value)
                _value = DBNull.Value;
              else
              {
                var _bIsTextFile = pbAutoDetectTextFile &&
                    BravoFileTypeDetector.isTextFile(pzFullFileName);
                if (_bIsTextFile)
                  _value = File.ReadAllText(pzFullFileName);
                else
                  _value = File.ReadAllBytes(pzFullFileName);
              }
            }
            else
            {
              _value = DBNull.Value;
            }
            break;

          case SelectedMemberEnum.ZipContent:
            if (pZipContent != null)
            {
              _value = pZipContent;
            }
            else if (_bIsValidFileName)
            {
              if (_bFileExists == null)
                _bFileExists = File.Exists(pzFullFileName);
              if (!_bFileExists.Value)
              {
                _value = DBNull.Value;
              }
              else
              {
                using (var _zt = ZipTool.create())
                {
                  _zt.addFile(pzFullFileName);
                  using (var _ms = new MemoryStream())
                  {
                    _zt.save(_ms);
                    _value = _ms.ToArray();
                  }
                }
              }
            }
            else
            {
              _value = DBNull.Value;
            }
            break;

          case SelectedMemberEnum.FileSize:
            if (pnFileSize >= 0)
            {
              _value = pnFileSize;
            }
            else if (_bIsValidFileName)
            {
              if (_bFileExists == null)
                _bFileExists = File.Exists(pzFullFileName);
              if (!_bFileExists.Value)
              {
                _value = DBNull.Value;
              }
              else
              {
                if (_fi == null) _fi = new FileInfo(pzFullFileName);
                _value = _fi.Length;
              }
            }
            else
            {
              _value = DBNull.Value;
            }
            break;

          case SelectedMemberEnum.FileReadTime:
          case SelectedMemberEnum.FileReadTimeUTC:
          case SelectedMemberEnum.FileWriteTime:
          case SelectedMemberEnum.FileWriteTimeUTC:
            if (_bIsValidFileName)
            {
              if (_bFileExists == null)
                _bFileExists = File.Exists(pzFullFileName);
              if (!_bFileExists.Value)
              {
                _value = DBNull.Value;
              }
              else
              {
                if (_fi == null) _fi = new FileInfo(pzFullFileName);

                if (_e == SelectedMemberEnum.FileReadTime)
                  _value = _fi.LastAccessTime;
                else if (_e == SelectedMemberEnum.FileReadTimeUTC)
                  _value = _fi.LastAccessTimeUtc;
                else if (_e == SelectedMemberEnum.FileWriteTime)
                  _value = _fi.LastWriteTime;
                else if (_e == SelectedMemberEnum.FileWriteTimeUTC)
                  _value = _fi.LastWriteTimeUtc;
              }
            }
            else
            {
              _value = DBNull.Value;
            }
            break;

          case SelectedMemberEnum.ImageDimension:
          case SelectedMemberEnum.ImageResolution:
          case SelectedMemberEnum.ImagePixelFormat:
          case SelectedMemberEnum.ImageThumbnail:
            if (pImageContent == null && _bIsValidFileName)
            {
              if (_bFileExists == null)
                _bFileExists = File.Exists(pzFullFileName);
              if (!_bFileExists.Value)
                _value = DBNull.Value;
              else
                pImageContent = _imageTemp = Image.FromFile(pzFullFileName);
            }
            if (pImageContent != null)
            {
              if (_e == SelectedMemberEnum.ImageDimension)
                _value = string.Format("{0}x{1}",
                    pImageContent.PhysicalDimension.Width,
                    pImageContent.PhysicalDimension.Height);
              else if (_e == SelectedMemberEnum.ImageResolution)
                _value = string.Format("{0}x{1}",
                    pImageContent.HorizontalResolution,
                    pImageContent.VerticalResolution);
              else if (_e == SelectedMemberEnum.ImagePixelFormat)
                _value = pImageContent.PixelFormat.ToString();
              else if (_e == SelectedMemberEnum.ImageThumbnail &&
                      pnThumbnailHeight > 0 && pnThumbnailWidth > 0)
              {
                var _size = BravoGraphicsRenderer.calculateSizeToFit(pImageContent.Size,
                    new Size(pnThumbnailWidth, pnThumbnailHeight),
                    BravoGraphicsRenderer.SizeModeEnum.FitIn);
                using (var _img = pImageContent.GetThumbnailImage(
                        _size.Width, _size.Height, null, IntPtr.Zero))
                  _value = BravoPictureBox.convertToBytes(_img);
              }
            }
            else
            {
              _value = DBNull.Value;
            }
            break;

          default:
            throw new NotSupportedException(string.Format("{0} does not support '{1}' for selected member.",
                pControl.GetType().Name, _e));
        }
      }
      catch (IOException _ex)
      {
        BravoErrorHandler.showError(_ex, pControl, string.Format(BravoResourceManager.getString(
            BravoResourceManager.StringEnum.Msg_OpenFileError), pzFullFileName));
      }

      if (pValues == null) pValues = new Dictionary<SelectedMemberEnum, object>();
      pValues.Add(_e, _value);

      if (_value == null)
        continue;

      if (_dr != null)
      {
        foreach (string _zColName in _s)
        {
          if (!_dr.Table.Columns.Contains(_zColName))
            throw new NullReferenceException(string.Format(
                Properties.Resources.ColumnDoesNotExist, _zColName, _dr.Table.TableName));

          if (_dr.Table.Columns[_zColName].ReadOnly)
            continue;

          _dr[_zColName] = _value;
          if (!_bUpdated) _bUpdated = true;
        }
      }
    }

    return _bUpdated;
  }
  finally
  {
    if (_imageTemp != null)
    {
      _imageTemp.Dispose();
      _imageTemp = null;
    }
  }
}