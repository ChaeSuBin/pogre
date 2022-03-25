export const onFileInputChange = (e) => {
  const reader = new FileReader();
  const fileByteArray = [];
  //console.log(evt.target.files[0]);

  reader.readAsArrayBuffer(e.target.files[0]);
  reader.onloadend = (_evt) => {
    if (_evt.target.readyState === FileReader.DONE) {
      const arrayBuffer = _evt.target.result,
        array = new Uint8Array(arrayBuffer);
    for (const a of array) {
      fileByteArray.push(a);
    }
    //console.log(fileByteArray);
    }
  }
  return fileByteArray;
}