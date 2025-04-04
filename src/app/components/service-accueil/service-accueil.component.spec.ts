import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAccueilComponent } from './service-accueil.component';

describe('ServiceAccueilComponent', () => {
  let component: ServiceAccueilComponent;
  let fixture: ComponentFixture<ServiceAccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAccueilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceAccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
