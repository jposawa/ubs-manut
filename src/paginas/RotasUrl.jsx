import { Route, Routes } from "react-router-dom";
import { MenuPrincipal } from "./MenuPrincipal";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { ListaUbs } from "./ListaUbs";
import { CadAltUbs } from "./cadAltUbs";
import { ListaTerceirizadas } from "./ListaTerceirizadas";
import { CadAltTerceirizadas } from "./cadAltTerceirizadas";

export const RotasUrl = () => {
  return(
    <Routes>
       <Route path="/" exact element = {
        <MenuPrincipal/>
      } />
      <Route path="menuprincipal" exact element = {
        <MenuPrincipal/>
      } />
      <Route path="login" exact element = {
        <Login/>
      } />
      <Route path="logout" exact element = {
        <Logout/>
      } />
      <Route path="listaubs" exact element = {
        <ListaUbs/>
      } />
       <Route path="cadaltubs" exact element = {
        <CadAltUbs/>
      } />
      <Route path="cadaltubs/:id" element = {
        <CadAltUbs/>
      } />
      <Route path="listaterceirizadas" exact element = {
        <ListaTerceirizadas/>
      } />
       <Route path="cadaltterceirizadas/:id" exact element = {
        <CadAltTerceirizadas/>
      } />
      <Route path="cadaltterceirizadas" exact element = {
        <CadAltTerceirizadas/>
      } />
    </Routes>
  )
}
