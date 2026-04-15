import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:5000/api/v1.0';

test.describe('Fluxo de Pessoa', () => {
  test('cria pessoa adulta via API e verifica que pode ser recuperada', async ({ page, request }) => {
    const uniqueName = `Test User ${Date.now()}`;
    const response = await request.post(`${API_BASE}/pessoas`, {
      data: { nome: uniqueName, dataNascimento: '2000-06-15' },
    });
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.nome).toBe(uniqueName);
    expect(body.idade).toBeGreaterThan(0);

    // Navega para página de pessoas - verifica que UI carrega sem erros
    await page.goto('/pessoas');
    await page.waitForTimeout(500);
    // Verifica que a lista renderiza
    await expect(page.getByRole('heading', { name: 'Pessoas' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('cria pessoa menor via API e verifica cálculo de idade', async ({ request }) => {
    const response = await request.post(`${API_BASE}/pessoas`, {
      data: { nome: 'Menor Test', dataNascimento: '2010-10-20' },
    });
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.nome).toBe('Menor Test');
    expect(body.idade).toBeLessThan(18);
  });

  test('servidor rejeita data de nascimento futura via API', async ({ request }) => {
    const response = await request.post(`${API_BASE}/pessoas`, {
      data: {
        nome: 'Futuro Test',
        dataNascimento: '2099-01-01',
      },
    });

    // Validação da API rejeita datas futuras via atributo CustomValidation
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  test('edita pessoa existente via API', async ({ page, request }) => {
    const createResp = await request.post(`${API_BASE}/pessoas`, {
      data: { nome: 'Edit Before API', dataNascimento: '1995-01-01' },
    });
    expect(createResp.ok()).toBe(true);
    const created = await createResp.json();

    const updateResp = await request.put(`${API_BASE}/pessoas/${created.id}`, {
      data: { nome: 'Edit After API', dataNascimento: '1995-01-01' },
    });
    expect([200, 204]).toContain(updateResp.status());

    const getResp = await request.get(`${API_BASE}/pessoas/${created.id}`);
    expect(getResp.status()).toBe(200);
    const body = await getResp.json();
    expect(body.nome).toBe('Edit After API');

    // Verifica que UI carrega
    await page.goto('/pessoas');
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: 'Pessoas' })).toBeVisible();
  });

  test('exclui pessoa via API', async ({ request }) => {
    const createResp = await request.post(`${API_BASE}/pessoas`, {
      data: { nome: 'Delete Me API', dataNascimento: '1980-01-01' },
    });
    expect(createResp.ok()).toBe(true);
    const created = await createResp.json();

    const deleteResp = await request.delete(`${API_BASE}/pessoas/${created.id}`);
    expect([200, 204]).toContain(deleteResp.status());

    const getResp = await request.get(`${API_BASE}/pessoas/${created.id}`);
    expect(getResp.status()).toBe(404);
  });
});
