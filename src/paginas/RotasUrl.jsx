import { Route, Routes } from "react-router-dom";
import { MenuPrincipal } from "./MenuPrincipal";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { ListaUbs } from "./ListaUbs";
import { CadAltUbs } from "./cadAltUbs";
import { ListaTerceirizadas } from "./ListaTerceirizadas";
import { CadAltTerceirizadas } from "./cadAltTerceirizadas";
import { ListaProdutos } from "./ListaProdutos";
import { CadAltProdutos } from "./cadAltProdutos";
import { ListaProdutosUbs } from "./ListaProdutosUbs";
import { CadastraProdutosUbs } from "./CadastraProdutosUbs";
import { GerarOs } from "./GerarOs";
import { ServicosSolicitados } from "./ServicosSolicitados";
import { FecharOs } from "./FecharOs";
import { ImprimeOS } from "./ImprimeOS";
import { ListaPecas } from "./ListaPecas";
import { CadAltPecas } from "./cadAltPecas";
import { ListaServicos } from "./ListaServicos";
import { CadAltServicos } from "./cadAltServicos";

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
       <Route path="listaprodutos" exact element = {
        <ListaProdutos/>
      } />
       <Route path="cadaltprodutos/:id" exact element = {
        <CadAltProdutos/>
      } />
      <Route path="cadaltprodutos" exact element = {
        <CadAltProdutos/>
      } />
       <Route path="listaprodutosubs/:id" exact element = {
        <ListaProdutosUbs/>
      } />
       <Route path="cadastraprodutosubs/:id" exact element = {
        <CadastraProdutosUbs/>
      } />
      <Route path="listapecas" exact element = {
        <ListaPecas/>
      } />
      <Route path="cadaltpecas" exact element = {
        <CadAltPecas/>
      } />
      <Route path="cadaltpecas/:id" exact element = {
        <CadAltPecas/>
      } />
      <Route path="listaservicos" exact element = {
        <ListaServicos/>
      } />
      <Route path="cadaltservicos" exact element = {
        <CadAltServicos/>
      } />
       <Route path="cadaltservicos/:id" exact element = {
        <CadAltServicos/>
      } />
       <Route path="geraros" exact element = {
        <GerarOs/>
      } />
       <Route path="fecharos/:id" exact element = {
        <FecharOs/>
      } />
       <Route path="servicossolicitados" exact element = {
        <ServicosSolicitados/>
      } />
      <Route path="imprimeos/:id" exact element = {
        <ImprimeOS/>
      } />
    </Routes>
  )
}
