import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'bravo-test',
  templateUrl: './bravo.test.html',
  styleUrls: ['./bravo.test.scss']
})
export class BravoTest implements OnInit {

  public formPictureBox = this.fb.group({
    dataImage: []
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
