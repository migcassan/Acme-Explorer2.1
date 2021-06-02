import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripHistoryComponent } from './trip-history.component';

describe('TripHistoryComponent', () => {
  let component: TripHistoryComponent;
  let fixture: ComponentFixture<TripHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
