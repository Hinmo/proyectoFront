import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarOportunidadComponent } from './asignar-oportunidad.component';

describe('AsignarOportunidadComponent', () => {
  let component: AsignarOportunidadComponent;
  let fixture: ComponentFixture<AsignarOportunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarOportunidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignarOportunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
