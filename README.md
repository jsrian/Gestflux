#  GestFlux - MVP
![Logo GestFlux](./public/logo.jpeg)
> **Redirecionando vidas para o cuidado certo, no tempo certo.**

O **GestFlux** é uma plataforma desenvolvida para otimizar o fluxo de pacientes em hospitais e unidades de saúde. Nosso objetivo principal é **direcionar as pessoas para o melhor hospital disponível no momento**, considerando localização, especialidade e, principalmente, a lotação em tempo real.

Através de dados e geolocalização, ajudamos a reduzir o tempo de espera e a sobrecarga no sistema de saúde, garantindo que o paciente chegue onde será atendido mais rápido.

---

## 🚧 Status do Projeto: MVP (Em Desenvolvimento)

Este projeto encontra-se em estágio de **MVP (Minimum Viable Product)**. 
A estrutura base de arquitetura (Clean Architecture) e a funcionalidade core de visualização de hospitais no mapa já estão implementadas, mas muitas funcionalidades planejadas ainda estão em construção.

### ✅ O que já funciona:
- Visualização de hospitais próximos no mapa (OpenStreetMaps).
- Cálculo de distância real do usuário até a unidade.
- Simulação de status de lotação (Vazio, Moderado, Lotado).
- Interface responsiva e arquitetura modular (Clean Architecture).

### 🚀 O que falta implementar (Roadmap):

#### 🤖 IA e Machine Learning
- **O Gestinho (Assistente Virtual):** Implementação do chatbot inteligente para pré-triagem e dúvidas rápidas.
- **Machine Learning Preditivo:** Algoritmos reais para prever a lotação dos hospitais com base em dados históricos, clima e eventos locais (atualmente os dados são simulados).

#### 📊 Gestão e Dados
- **Dashboard Administrativo:** Painel para gestores hospitalares atualizarem status em tempo real e visualizarem métricas.
- **Integração com APIs Reais:** Conectar com sistemas de gestão hospitalar para dados reais de fila.

#### 📍 Navegação
- **Melhorias de Rotas:** Integração avançada para traçar a rota exata (turn-by-turn) dentro do próprio app, considerando trânsito.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído seguindo os princípios da **Clean Architecture** para garantir escalabilidade e fácil manutenção.

- **Frontend:** React, TypeScript, TailwindCSS.
- **Mapas:** OpenLayers, OpenStreetMaps (Overpass API).
- **Gerenciamento de Estado:** React Context API / Hooks customizados.
- **Arquitetura:** Clean Architecture (Domain, Application, Infrastructure, Presentation).

## 📂 Estrutura do Projeto

```text
/src
|--/domain           # Regras de negócio e Entidades (O "Coração" do app)
|--/application      # Casos de uso (Lógica de aplicação)
|--/infrastructure   # Comunicação externa (APIs, Banco de Dados)
|--/presentation     # Interface do usuário (Componentes React, Páginas)
|--/main             # Configuração e Injeção de Dependências
