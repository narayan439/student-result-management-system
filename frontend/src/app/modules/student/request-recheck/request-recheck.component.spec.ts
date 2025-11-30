import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRecheckComponent } from './request-recheck.component';

describe('RequestRecheckComponent', () => {
  let component: RequestRecheckComponent;
  let fixture: ComponentFixture<RequestRecheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestRecheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestRecheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
