# Arquitetura UFC hub
### UFC hub permite que alunos e professores da UFC se comuniquem de forma centralizada sobre assuntos comumente abordados no ambiente universitário

## Requisitos Funcionais

### Login
1. Usuário deve conseguir criar sua conta na plataforma, inserindo seu email, senha, nome e curso.
2. Usuário deve conseguir se logar com sua conta, utilizando seu email e senha.
### Grupos
3. Usuário deve conseguir criar grupos de comunicação com outros usuários, inserindo nome e descrição.
4. Usuário deve conseguir editar grupo criado por ele, adicionar novos membros, deletar grupo e mudar o papel de um membro no grupo. Membros desse grupo podem conversar por meio de um chat.
5. Usuário admin de um grupo pode adicionar e remover membros desse grupo.
### Eventos
6. Usuário deve conseguir criar evento, editar e deletar se for criado por ele.
7. Usuário deve conseguir comentar, marcar participação e "curtir" eventos que irão acontecer, em que a data é maior que o dia atual.
8. Usuário visitante deve conseguir visualizar os eventos, porém não pode realizar nenhuma ação.
### Blog
10. Usuário deve conseguir criar uma postagem no blog, editar e deletar se for criado por ele.
11. Usuário deve conseguir comentar e "curtir" uma postagem feita por outro usuário.
12. Usuário visitante deve conseguir visualizar as postagens, porém não pode realizar nenhuma ação.
### Home
13. Usuário deve conseguir visualizar postagens e eventos "em alta".

## Requisitos Não Funcionais

- Segurança dos dados e limitações de acordo se o usuário está logado ou não. 
- Chat de grupo em tempo real.
- Acessibilidade (modo escuro e auto contraste) e responsividade mobile.
- Qualquer usuário logado tem acesso total as funcionalidades da aplicação. (Não há roles diferentes de usuários)

## Entidades Principais
- User
- Group
- Event
- Blog
- Messages

<img width="16637" height="9309" alt="Imagem Arquitetura" src="https://github.com/user-attachments/assets/e32ad949-d24a-462e-b1d8-40ece6466386" />
