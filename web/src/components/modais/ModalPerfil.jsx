// import { useState } from "react";
// import "../../styles/Layouts/Modais.css";
// import {
//     PencilSimple,
//     Camera
// } from "@phosphor-icons/react";

// export default function ModalPerfil() {
//     // Mock: pega o primeiro setor por enquanto (você trocará por seleção real)
//     const setor = setores[0];

//     // Estado para ver mais perfis
//     const [showVerMais, setShowVerMais] = useState(false);
//     // Estado para editar foto (overlay)
//     const [editFoto, setEditFoto] = useState(false);

//     // === Regra híbrida: se setor tiver perfis/chamados, usa-os; senão puxa de chamadosMock ===
//     const chamadosDoSetor =
//         (setor.chamados && setor.chamados.length > 0)
//             ? setor.chamados
//             : chamadosMock.filter((c) => c.setor === setor.nome).map((c) => ({
//                 id: c.id,
//                 titulo: c.titulo,
//                 descricao: c.descricaoProblema || c.descricaoSolucao,
//                 perfil: c.perfil,
//                 dataHora: c.dataHora,
//             }));

//     // Perfis: se setor.perfis existir, usa; senão extrai perfis únicos de chamadosDoSetor
//     const perfisList =
//         (setor.perfis && setor.perfis.length > 0)
//             ? setor.perfis
//             : Array.from(
//                 new Map(
//                     chamadosDoSetor
//                         .map((c, idx) => ({ id: idx + 1, nome: c.perfil || "Usuário" }))
//                         .map((p) => [p.nome, p])
//                 ).values()
//             );

//     // Último chamado (por dataHora se disponível)
//     // Último chamado (por dataHora se disponível)
//     const ultimoChamado =
//         chamadosDoSetor.length > 0
//             ? [...chamadosDoSetor].sort((a, b) => {
//                 const da = new Date(a.dataHora || 0).getTime();
//                 const db = new Date(b.dataHora || 0).getTime();
//                 return da - db; // pega o último (não o primeiro)
//             }).at(-1) // último da lista
//             : null;

//     // Autorização (placeholder) — aqui você deve colocar sua verificação real de auth/perfil
//     const isAllowedToView = true; // TODO: substituir pela verificação real (ex: userType === 'informatica' || userIsOwner)

//     if (!isAllowedToView) {
//         return (
//             <div className="modal-perfil">
//                 <p>Você não tem permissão para visualizar este conteúdo.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="modal-perfil">
//             {/* Fechar */}
//             <button className="close-btn" title="Fechar">X</button>

//             {/* Topo */}
//             <div className="modal-top">
//                 <div
//                     className={`perfil-img ${editFoto ? "perfil-img--edit" : ""}`}
//                     onClick={() => {
//                         if (editFoto) {
//                             // aqui poderia abrir um uploader real
//                             console.log("Abrir uploader (placeholder)");
//                         }
//                     }}
//                 >
//                     <img src={setor.imagemPerfil} alt={setor.nome} />
//                     {editFoto && (
//                         <div className="perfil-img__overlay" onClick={() => console.log("Upload placeholder")}>
//                             <Camera size={32} color="#fffafa" weight="bold" />
//                         </div>
//                     )}
//                 </div>

//                 <div className="setor-nome">
//                     <h2>{setor.nome}</h2>
//                 </div>
//             </div>

//             {/* Meio */}
//             <div className="modal-middle">
//                 {/* Perfis */}
//                 <div className="perfis bloco interno-com-contorno">
//                     <h3>PERFIS</h3>

//                     <div className="lista-perfis">
//                         {perfisList.slice(0, 2).map((perfil) => (
//                             <div key={perfil.id} className="perfil-item perfil-item--card">
//                                 {perfil.nome}
//                             </div>
//                         ))}
//                     </div>

//                     {perfisList.length > 2 && (
//                         <button className="ver-mais" onClick={() => setShowVerMais(true)}>
//                             VER MAIS
//                         </button>
//                     )}
//                 </div>

//                 {/* Criado em / Chamados */}
//                 <div className="dados-meio bloco interno-com-contorno">
//                     <div className="criado-em">
//                         <p className="label-pequena">CRIADO EM:</p>
//                         <span className="valor-pequena">{setor.criadoEm}</span>
//                     </div>

//                     <div className="chamados bloco-chamados">
//                         <p className="label-pequena">CHAMADOS:</p>
//                         <span className="numero-chamados">{chamadosDoSetor.length}</span>
//                     </div>
//                 </div>

//                 {/* Criado por / Último chamado */}
//                 <div className="dados-direita bloco interno-com-contorno">


//                     <div className="ultimo-chamado">
//                         <p className="label-pequena">ÚLTIMO CHAMADO:</p>
//                         {ultimoChamado ? (
//                             <div className="chamado-info">
//                                 <strong className="titulo-ultimo">{ultimoChamado.titulo}</strong>
//                                 <p className="descricao-ultimo">{ultimoChamado.descricao}</p>
//                             </div>
//                         ) : (
//                             <div className="chamado-info vazio">Nenhum chamado</div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Rodapé */}
//             <div className="modal-bottom">
//                 <div className="codigo-entrada bloco interno-com-contorno">
//                     <p className="label-pequena">CÓDIGO DE ENTRADA:</p>
//                     <div className="codigo">{setor.codigoEntrada}</div>
//                 </div>

//                 <div className="acoes-rodape">
//                     <button
//                         className="btn-editar-foto"
//                         onClick={() => setEditFoto((s) => !s)}
//                         title="Trocar foto"
//                     >
//                         <PencilSimple size={32} color="#fffafa" weight="regular" />
//                     </button>
//                 </div>
//             </div>

//             {/* Modal VER MAIS (pequeno) */}
//             {showVerMais && (
//                 <div className="modal-pequeno-backdrop" onClick={() => setShowVerMais(false)}>
//                     <div className="modal-pequeno" onClick={(e) => e.stopPropagation()}>
//                         <button className="close-pequeno" onClick={() => setShowVerMais(false)}>X</button>
//                         <h4>Perfis — {setor.nome}</h4>
//                         <ul className="lista-vermais">
//                             {perfisList.map((p) => (
//                                 <li key={p.id}>{p.nome}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
