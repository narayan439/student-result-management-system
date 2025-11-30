import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecheckRequestsComponent } from './recheck-requests.component';

describe('RecheckRequestsComponent', () => {
  let component: RecheckRequestsComponent;
  let fixture: ComponentFixture<RecheckRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecheckRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecheckRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
