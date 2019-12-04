import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWebComponent } from './request-web.component';

describe('RequestWebComponent', () => {
  let component: RequestWebComponent;
  let fixture: ComponentFixture<RequestWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestWebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
