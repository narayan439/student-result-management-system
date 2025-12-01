import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRechecksComponent } from './manage-rechecks.component';

describe('ManageRechecksComponent', () => {
  let component: ManageRechecksComponent;
  let fixture: ComponentFixture<ManageRechecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRechecksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRechecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
