import React, { useState, useEffect } from "react";
import axios from "axios";

interface Plano {
  id: string;
  nome: string;
  valor: number;
}

export default function Planos() {
  const [mensagem, setMensagem] = useState<string>("");
  const [matriculado, setMatriculado] = useState<boolean>(false);
  const [saldo, setSaldo] = useState<number>(0);
  const [valorDeposito, setValorDeposito] = useState<number>(0);

  const token = localStorage.getItem("token");

  const planos: Plano[] = [
    { id: "1", nome: "Plano Mensal", valor: 100 },
    { id: "2", nome: "Plano Trimestral", valor: 270 },
    { id: "3", nome: "Plano Semestral", valor: 500 },
  ];

  useEffect(() => {
    if (!token) return;

    axios
      .get("/api/pagamento", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const pagamentos = res.data;
        if (pagamentos.length > 0) {
          const ultimo = pagamentos[pagamentos.length - 1];
          setMatriculado(ultimo.aluno.matriculado);
          setSaldo(Number(ultimo.aluno.saldo));
        }
      })
      .catch(() => {
        setMatriculado(false);
        setSaldo(0);
      });
  }, [token]);

  const pagarPlano = async (plano: Plano) => {
    if (!token) return;

    if (saldo < plano.valor) {
      setMensagem("Saldo insuficiente para realizar o pagamento.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/pagamento",
        {
          alunoId: "", // backend pode usar token
          metodo: "DINHEIRO",
          valor: plano.valor,
          status: "PAGO",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem(`Pagamento do ${plano.nome} realizado com sucesso!`);
      setMatriculado(true);
      setSaldo(prev => prev - plano.valor);
    } catch (error: any) {
      setMensagem(error?.response?.data?.erro || "Erro ao processar pagamento.");
    }
  };

  const recarregarSaldo = async () => {
    if (!token) return;

    if (valorDeposito <= 0) {
      setMensagem("Informe um valor válido para depósito.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/deposito",
        {
          alunoId: "", // backend pode pegar do token
          metodo: "DINHEIRO",
          valor: valorDeposito,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaldo(res.data.aluno.saldo);
      setMensagem(`Saldo recarregado com sucesso: R$ ${valorDeposito}`);
      setValorDeposito(0);
    } catch (error: any) {
      setMensagem(error?.response?.data?.erro || "Erro ao recarregar saldo.");
    }
  };

  if (!token) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 font-semibold">
          Para acessar nossos planos, faça login.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Planos da Academia</h2>

      <p className="mb-2">Saldo atual: R$ {saldo}</p>

      <div className="mb-4">
        <input
          type="number"
          value={valorDeposito}
          onChange={e => setValorDeposito(Number(e.target.value))}
          placeholder="Valor para recarregar"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={recarregarSaldo}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Recarregar Saldo
        </button>
      </div>

      {mensagem && <p className="text-red-500 mb-2">{mensagem}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planos.map(plano => (
          <div
            key={plano.id}
            className={`p-4 border rounded shadow ${
              matriculado ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <h3 className="text-xl font-semibold">{plano.nome}</h3>
            <p>Valor: R$ {plano.valor}</p>
            {!matriculado && (
              <button
                onClick={() => pagarPlano(plano)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Pagar
              </button>
            )}
            {matriculado && (
              <p className="mt-2 font-semibold text-green-600">Plano ativo</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
