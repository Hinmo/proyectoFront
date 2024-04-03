import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseUsuariosComponent } from './base-usuarios.component';

describe('BaseUsuariosComponent', () => {
  let component: BaseUsuariosComponent;
  let fixture: ComponentFixture<BaseUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseUsuariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaseUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
