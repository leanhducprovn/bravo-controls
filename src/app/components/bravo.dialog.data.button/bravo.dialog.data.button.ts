import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bravo-dialog-data-button',
  templateUrl: './bravo.dialog.data.button.html',
  styleUrls: ['./bravo.dialog.data.button.css']
})
export class BravoDialogDataButton implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "file:///C:/Users/ducla/Downloads/img/bi_Cross.png", true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      console.log(this.response);
      var reader = new FileReader();
      reader.onload = function (event) {
        var res = event.target.result;
        console.log(res)
      }
      var file = this.response;
      reader.readAsDataURL(file)
    };
    xhr.send()
  }

}
