import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackRecheckComponent } from './track-recheck.component';

describe('TrackRecheckComponent', () => {
  let component: TrackRecheckComponent;
  let fixture: ComponentFixture<TrackRecheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackRecheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackRecheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
