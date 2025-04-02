import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDevisComponent } from './client-devis.component';

describe('ClientDevisComponent', () => {
  let component: ClientDevisComponent;
  let fixture: ComponentFixture<ClientDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDevisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
