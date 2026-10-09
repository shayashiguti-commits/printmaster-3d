# PrintMaster 3D

Sistema especialista full-stack em diagnóstico de falhas na impressão 3D, atlas técnico de configurações do **Bambu Studio** e consultor inteligente de preparação geométrica de modelos.

## 🚀 Visão Geral e Recursos Principais

1. **Diagnóstico Multimodal de Impressão:**
   - Triagem técnica orientada a hipóteses concorrentes e testes de baixo risco.
   - Análise de fotografias e sintomas textuais (FDM e SLA/MSLA).
   - Protocolo universal de segurança com parada imediata (`stop`) em detecção de superaquecimento ou risco elétrico.
   - Máquina de estados do caso: `new` ➔ `collecting_context` ➔ `hypotheses` ➔ `awaiting_test` ➔ `evaluating_test` ➔ `resolved`.
   - Registro de feedback de testes: *Resolveu*, *Melhorou*, *Não resolveu*.

2. **Atlas Bambu Studio Auditado:**
   - Mais de 70 configurações categorizadas (*Quality, Strength, Speed, Support, Others, Filament, Printer*).
   - Busca bilíngue (Português, Inglês, `config_key` interna).
   - Sinalização rigorosa de status de revisão: *Verificado* vs *Localização a confirmar*.
   - Integração direta: "Perguntar à IA sobre este campo".

3. **Preparador Inteligente de Peças 3D:**
   - **Visualizador 3D real** em Three.js com órbita, rotação axial e grade simulando mesa Bambu Lab (256×256mm).
   - **Parser geométrico de STL**: Bounding box milimétrico real (X, Y, Z), contagem de triângulos, detecção de faces degeneradas e cálculo de volume por Teorema da Divergência.
   - **Inspeção segura de contêineres 3MF**: Identificação de projetos Bambu Studio vs 3MF genérico e proteção contra Zip Bombs.
   - Formulação de objetivos (*Resistência, Estética, Tolerância, Rapidez, Economia*) gerando checklist técnico para o slicer.

4. **Equipamentos e Materiais:**
   - Gerenciamento de impressoras do usuário (A1, A1 mini, P1S, X1 Carbon, etc.), bicos e tipos de placa.
   - Catálogo de filamentos com diretrizes de temperatura e secagem recomendadas.

5. **Catálogo de Calibração Oficial:**
   - 14 rotinas técnicas (primeira camada, fluxo, Pressure Advance, torre de temperatura, vazão volumétrica máxima, pontes, tolerâncias) sem comandos destrutivos.

6. **Painel Administrativo & Suíte de Testes QA (QA01 - QA10):**
   - Executor automatizado em tempo real no servidor verificando busca no atlas, shields de segurança, isolamento de usuários e integridade de parsers.
   - Relatório de cobertura versionada do atlas.

## 🛠️ Tecnologias e Arquitetura

- **Frontend:** React 19, TypeScript, Tailwind CSS, Three.js, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript (`tsx`), Zod (validação de schemas).
- **IA Multimodal:** SDK oficial `@google/genai` (modelo `gemini-3.8-flash`) executado no lado do servidor.
- **Persistência:** Repositório `JsonFileStorageRepository` implementando `IPersistentRepository` (`data/runtime_db.json`), com isolamento rigoroso por usuário e compatível com adaptadores Firestore/Supabase.

## 🔐 Variáveis de Ambiente

Configuradas em `.env`:
```env
GEMINI_API_KEY="sua_chave_gemini_aqui"
PORT=3000
```
> *Nota de segurança: `GEMINI_API_KEY` é acessada exclusivamente pelo backend Node.js (`process.env.GEMINI_API_KEY`) e nunca é exposta no cliente.*

## 🧪 Suíte de Testes Automatizados (QA)

A suíte pode ser executada pela rota `GET /api/tests/run-qa-suite` ou diretamente no **Painel Admin & Auditoria**:
- **QA01:** Busca no atlas por `Layer height` e `altura da camada` retorna o mesmo verbete.
- **QA02:** Filtro por versão não confirma localizações de parâmetros não verificados.
- **QA03:** Diagnóstico de warping inicia com inspeção simples da mesa antes de propor alterações.
- **QA04:** Relato de fumaça ou odor elétrico dispara nível `stop` imediato.
- **QA05:** Parser de STL calcula bounding box milimétrico e trata arquivos corrompidos.
- **QA06:** Upload de 3MF é validado contra cabeçalhos ZIP maliciosos.
- **QA07:** Arquivo 3MF genérico não é rotulado falsamente como projeto Bambu Studio.
- **QA08:** Transparência de slicing: tempo e massa não são inventados sem fatiador real.
- **QA09:** Isolamento de dados entre usuários no repositório.
- **QA10:** Feedback "não resolveu" mantém o caso aberto.
