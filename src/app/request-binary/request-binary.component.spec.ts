import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBinaryComponent } from './request-binary.component';

describe('RequestBinaryComponent', () => {
  let component: RequestBinaryComponent;
  let fixture: ComponentFixture<RequestBinaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestBinaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestBinaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
