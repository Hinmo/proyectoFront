import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarOportunidadComponent } from './solicitar-oportunidad.component';

describe('SolicitarOportunidadComponent', () => {
  let component: SolicitarOportunidadComponent;
  let fixture: ComponentFixture<SolicitarOportunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarOportunidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitarOportunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
