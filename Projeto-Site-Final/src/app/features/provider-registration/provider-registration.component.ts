import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/types';
import { ProviderService } from '../../core/services/provider.service';

@Component({
  selector: 'app-register-loja',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './provider-registration.component.html',
  styleUrl: './provider-registration.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderRegistrationComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly prestadorService = inject(ProviderService);
  private currentUser: Usuario | null = null;

  readonly lojaForm = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Barbearia', Validators.required],
    endereco: ['', [Validators.required, Validators.minLength(5)]],
    cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
    horario: ['', [Validators.required, Validators.minLength(5)]],
    imagemUrl: [''],
  });
  fotos: string[] = [];
  buscandoCep = false;
  erroCep = '';
  erroFoto = '';
  categorias: string[] = [];
  novaCategoria = '';
  coordenadas?: { latitude: number; longitude: number };

  ngOnInit(): void {
    this.prestadorService.getCategories().subscribe((categories) => (this.categorias = categories));
    this.auth.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.coordenadas = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      });
    }
  }

  onSubmit(): void {
    if (this.lojaForm.invalid) {
      this.lojaForm.markAllAsTouched();
      return;
    }

    const user = this.currentUser;
    if (!user || user.tipo !== 'prestador') {
      void this.router.navigate(['/login']);
      return;
    }

    this.prestadorService.create({
      id: '',
      usuarioId: user.id,
      nomeEstabelecimento: this.lojaForm.controls.nome.value,
      categoria: this.lojaForm.controls.categoria.value,
      descricao: 'Estabelecimento cadastrado no NaHora Serv.',
      endereco: this.lojaForm.controls.endereco.value,
      cep: this.lojaForm.controls.cep.value,
      horarioFuncionamento: this.lojaForm.controls.horario.value,
      foto: this.fotos[0] || this.lojaForm.controls.imagemUrl.value || '/img/barbearia.webp',
      fotos: this.fotos,
      latitude: this.coordenadas?.latitude,
      longitude: this.coordenadas?.longitude,
    }).subscribe({
      next: () => void this.router.navigate(['/servicos-prestador']),
      error: () => {
        this.erroFoto = 'Não foi possível cadastrar o estabelecimento agora.';
      },
    });
  }

  async buscarCep(): Promise<void> {
    const cep = this.lojaForm.controls.cep.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    this.buscandoCep = true;
    this.erroCep = '';
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('Falha na consulta');
      const data = (await response.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (data.erro) {
        this.erroCep = 'CEP não encontrado.';
        return;
      }
      const address = [
        data.logradouro,
        data.bairro,
        data.localidade && `${data.localidade} - ${data.uf}`,
      ]
        .filter(Boolean)
        .join(', ');
      this.lojaForm.controls.endereco.setValue(address);
    } catch {
      this.erroCep = 'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.';
    } finally {
      this.buscandoCep = false;
    }
  }

  adicionarUrl(): void {
    const url = this.lojaForm.controls.imagemUrl.value.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      this.erroFoto = 'Informe uma URL válida para a imagem.';
      return;
    }
    this.fotos = [...this.fotos, url];
    this.lojaForm.controls.imagemUrl.setValue('');
    this.erroFoto = '';
  }

  selecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.erroFoto = 'Selecione um arquivo de imagem.';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.erroFoto = 'A imagem deve ter no máximo 2 MB.';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') this.fotos = [...this.fotos, reader.result];
    };
    reader.readAsDataURL(file);
    input.value = '';
    this.erroFoto = '';
  }

  removerFoto(index: number): void {
    this.fotos = this.fotos.filter((_, currentIndex) => currentIndex !== index);
  }

  adicionarCategoria(): void {
    const category = this.novaCategoria.trim();
    if (!category) return;
    this.prestadorService.addCategory(category).subscribe((categories) => {
      this.categorias = categories;
      this.lojaForm.controls.categoria.setValue(category);
      this.novaCategoria = '';
    });
  }
}
