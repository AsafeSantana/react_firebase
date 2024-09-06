import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import './App.css'; 

const firebaseApp = initializeApp({
  apiKey: "AIzaSyD0vxPokS-0X6_zogJ9hhAH0eJewbRDKWk",
  authDomain: "auth-login-68e7a.firebaseapp.com",
  projectId: "auth-login-68e7a",
});

export const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [userIdToUpdate, setUserIdToUpdate] = useState(null);

  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "users");

  //cria usuário
  async function createUser() {
    await addDoc(userCollectionRef, { name, email });
    setName("");
    setEmail("");
    getUsers();
  }

  //deleta usuário
  async function deleteUser(id) {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    getUsers(); 
  }

  //atualiza usuário
  async function updateUser(id) {
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, { name, email });
    setUserIdToUpdate(null);
    setName("");
    setEmail("");
    getUsers(); 
  }

  // busca usuários
  const getUsers = async () => {
    const data = await getDocs(userCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getUsers();
  }, []); 
  return (
    <div className="container">
      <h1>Usuários</h1> {/* Adicionando o título da página */}
      <form>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
  
        {userIdToUpdate ? (
          <button type="button" onClick={() => updateUser(userIdToUpdate)}>
            Atualizar Usuário
          </button>
        ) : (
          <button type="button" onClick={createUser}>
            Criar Usuário
          </button>
        )}
      </form>
  
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className="action-buttons">
                <button className="edit-button" onClick={() => {
                  setUserIdToUpdate(user.id);
                  setName(user.name);
                  setEmail(user.email);
                }}>
                  Editar
                </button>
                <button onClick={() => deleteUser(user.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};
