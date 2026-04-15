import { describe, it, expect } from 'vitest';
import { pessoaSchema, categoriaSchema, transacaoSchema } from '@/lib/schemas';
import { Finalidade, TipoTransacao } from '@/types/domain';

describe('pessoaSchema', () => {
  it('valid data passes', () => {
    const result = pessoaSchema.safeParse({
      nome: 'Joao Silva',
      dataNascimento: new Date(1990, 5, 15),
    });
    expect(result.success).toBe(true);
  });

  it('empty nome fails', () => {
    const result = pessoaSchema.safeParse({
      nome: '',
      dataNascimento: new Date(1990, 5, 15),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('obrigatório');
    }
  });

  it('nome over 200 chars fails', () => {
    const result = pessoaSchema.safeParse({
      nome: 'A'.repeat(201),
      dataNascimento: new Date(1990, 5, 15),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('200');
    }
  });

  it('missing dataNascimento fails', () => {
    const result = pessoaSchema.safeParse({
      nome: 'Joao',
    });
    expect(result.success).toBe(false);
  });
});

describe('categoriaSchema', () => {
  it('valid data passes', () => {
    const result = categoriaSchema.safeParse({
      descricao: 'Alimentacao',
      finalidade: Finalidade.Despesa,
    });
    expect(result.success).toBe(true);
  });

  it('empty descricao fails', () => {
    const result = categoriaSchema.safeParse({
      descricao: '',
      finalidade: Finalidade.Despesa,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('obrigatória');
    }
  });

  it('descricao over 200 chars fails', () => {
    const result = categoriaSchema.safeParse({
      descricao: 'B'.repeat(201),
      finalidade: Finalidade.Receita,
    });
    expect(result.success).toBe(false);
  });

  it('missing finalidade fails', () => {
    const result = categoriaSchema.safeParse({
      descricao: 'Test',
    });
    expect(result.success).toBe(false);
  });
});

describe('transacaoSchema', () => {
  it('valid data passes', () => {
    const result = transacaoSchema.safeParse({
      descricao: 'Compra',
      valor: 50.0,
      tipo: TipoTransacao.Despesa,
      categoriaId: '550e8400-e29b-41d4-a716-446655440000',
      pessoaId: '550e8400-e29b-41d4-a716-446655440001',
      data: new Date(),
    });
    expect(result.success).toBe(true);
  });

  it('negative valor fails', () => {
    const result = transacaoSchema.safeParse({
      descricao: 'Test',
      valor: -50,
      tipo: TipoTransacao.Despesa,
      categoriaId: '550e8400-e29b-41d4-a716-446655440000',
      pessoaId: '550e8400-e29b-41d4-a716-446655440001',
      data: new Date(),
    });
    expect(result.success).toBe(false);
  });

  it('zero valor fails', () => {
    const result = transacaoSchema.safeParse({
      descricao: 'Test',
      valor: 0,
      tipo: TipoTransacao.Despesa,
      categoriaId: '550e8400-e29b-41d4-a716-446655440000',
      pessoaId: '550e8400-e29b-41d4-a716-446655440001',
      data: new Date(),
    });
    expect(result.success).toBe(false);
  });

  it('empty categoriaId fails', () => {
    const result = transacaoSchema.safeParse({
      descricao: 'Test',
      valor: 50,
      tipo: TipoTransacao.Despesa,
      categoriaId: '',
      pessoaId: '550e8400-e29b-41d4-a716-446655440001',
      data: new Date(),
    });
    expect(result.success).toBe(false);
  });

  it('empty pessoaId fails', () => {
    const result = transacaoSchema.safeParse({
      descricao: 'Test',
      valor: 50,
      tipo: TipoTransacao.Despesa,
      categoriaId: '550e8400-e29b-41d4-a716-446655440000',
      pessoaId: '',
      data: new Date(),
    });
    expect(result.success).toBe(false);
  });

  it('descricao over 200 chars fails', () => {
    const result = transacaoSchema.safeParse({
      descricao: 'C'.repeat(201),
      valor: 50,
      tipo: TipoTransacao.Despesa,
      categoriaId: '550e8400-e29b-41d4-a716-446655440000',
      pessoaId: '550e8400-e29b-41d4-a716-446655440001',
      data: new Date(),
    });
    expect(result.success).toBe(false);
  });
});
