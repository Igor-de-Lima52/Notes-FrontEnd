import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCamera} from "react-icons/fi";

import { useAuth } from "../../hooks/auth";

import avatarPlaceholder from "../../assets/avatar_placeholder.svg";

import { api } from "../../services/api";
import { Container, Form, Avatar} from "./styles";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ButtonText } from "../../components/ButtonText";

export function Profile(){
  const navigate = useNavigate();

  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [passwordOld, setPasswordOld] = useState();
  const [passwordNew, setPasswordNew] = useState();

  const avatarUrl = user.avatar ? `${api.defaults.baseURL}/files/${user.avatar}` : avatarPlaceholder;
  const [avatar, setAvatar] = useState(avatarUrl);
  const [avatarFile, setAvatarFile] = useState(null);

  function handleChangeAvatar(e){
    const file = e.target.files[0];
    setAvatarFile(file);
    
    const imagePreview = URL.createObjectURL(file);
    setAvatar(imagePreview);
  }
  
  function handleBack(){
    navigate(-1);
  }

  async function handleUpdate(){
    const updated = {
      name,
      email,
      password: passwordNew,
      old_password: passwordOld,
    }
    
    const userUpdated = Object.assign(user, updated);

    await updateProfile({ user: userUpdated, avatarFile });
  }

  return(
    <Container>
      <header>
        <button type="button" onClick={handleBack}> 
          <FiArrowLeft />
        </button>
      </header>
      <Form>
        <Avatar>
          <img src={ avatar } alt="Foto do usuário" />
          <label htmlFor="avatar">
            <FiCamera />
            <input onChange={handleChangeAvatar} id="avatar" type="file"/>
          </label>
        </Avatar>
        <Input placeholder="Nome" type="text" icon={FiUser} value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="Email" type="text" icon={FiMail} value={email} onChange={e => setEmail(e.target.value)} />
        <Input placeholder="Senha atual" type="password" icon={FiLock} onChange={e => setPasswordOld(e.target.value)} />
        <Input placeholder="Nova senha" type="password" icon={FiLock} onChange={e => setPasswordNew(e.target.value)} />
        <Button title="Salvar" onClick={ handleUpdate } />
      </Form>
    </Container>
  )
}