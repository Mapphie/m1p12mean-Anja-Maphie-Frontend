import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashClientComponent } from './dash-client.component';

describe('DashClientComponent', () => {
  let component: DashClientComponent;
  let fixture: ComponentFixture<DashClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
