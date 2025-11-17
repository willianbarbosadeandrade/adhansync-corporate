# 10. Planejamento e Cronograma

Este documento apresenta o planejamento macro e o cronograma estimado para o desenvolvimento do MVP do AdhanSync Corporate.

---

# 10.1 Fases do Projeto

1. **Planejamento e documentação**
   - Definição do escopo.
   - Documentos 01–06.
2. **Setup da arquitetura e projetos C#**
   - Criação da Solution e projetos (`Core`, `Infrastructure`, `Api`, `Admin`, `Workers`).
3. **Modelagem do banco**
   - DER.
   - Migrations.
4. **Implementação da API base**
   - Autenticação.
   - Multi-tenant.
   - Endpoints iniciais.
5. **Extensão do navegador**
   - Interface básica.
   - Consumo da API.
6. **Painel administrativo (Blazor)**
   - Telas de cadastro e configuração.
7. **Workers**
   - Recalcular horários.
   - Notificações.
8. **Testes e ajustes finais**
   - Testes unitários e de integração.
9. **Entrega e homologação**

---

# 10.2 Cronograma Sugerido (8 Semanas)

| Semana | Atividades principais |
|--------|------------------------|
| 1 | Definição de escopo, arquitetura conceitual, docs 01–06 |
| 2 | Criação da solução .NET, projetos e estrutura de pastas |
| 3 | Modelagem de dados, Migrations, endpoints de autenticação |
| 4 | Implementação dos métodos de cálculo e endpoints de horários |
| 5 | Desenvolvimento da extensão (UI + integração com API) |
| 6 | Desenvolvimento do painel admin em Blazor (telas principais) |
| 7 | Criação de workers e tarefas agendadas, testes iniciais |
| 8 | Refino, testes finais, ajustes de documentação e apresentação |

---

# 10.3 Entradas e Saídas por Fase

- **Entrada**: requisitos, contexto, objetivos, decisões de arquitetura.
- **Saída**: código funcional, documentação atualizada, ambiente de testes.

---

# 10.4 Riscos e Mitigações

- **Atrasos no desenvolvimento**  
  Mitigação: priorizar MVP, reduzir escopo de funcionalidades não críticas.

- **Complexidade dos cálculos de oração**  
  Mitigação: utilizar bibliotecas já consolidadas e validar com casos reais.

- **Dificuldade com Deploy**  
  Mitigação: começar simples com um único ambiente em cloud (Railway/Azure).

---

# 10.5 Conclusão

O cronograma prioriza entregas incrementais, com foco no MVP funcional e na documentação acadêmica robusta, garantindo que o projeto possa ser apresentado e, ao mesmo tempo, evoluir para um produto de mercado.
