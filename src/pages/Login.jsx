import React, { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import useAuthentication from "../hooks/useAuthentication";

import {
  Wrapper,
  Brand,
  Card,
  Title,
  Input,
  PasswordWrapper,
  Button,
  Field,
  Label,
  IconWrapper,
} from "../components/ui/Login.styles";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, isLoading } = useAuthentication();

  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <Wrapper>
      {/* FORM */}
      <Brand>Megadis</Brand>

      <Card as="form" onSubmit={handleSubmit}>
        <Title>Bienvenido!</Title>
        <Field>
          <Label>Correo</Label>
          <Input
            type="email"
            placeholder="Ingrese su correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
            enterKeyHint="next"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                passwordRef.current.focus();
              }
            }}
          />
        </Field>

        <Field>
          <Label>Contraseña</Label>
          <PasswordWrapper>
            <Input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              enterKeyHint="go"
            />
            
            <IconWrapper
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </IconWrapper>
          </PasswordWrapper>
        </Field>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </Button>
      </Card>
    </Wrapper>
  );
}

export default Login;