// Hospede este código em um serviço como Vercel/Netlify
export default async (req, res) => {
  const { titulo, descricao } = req.body;
  
  const response = await fetch('https://api.github.com/repos/tiemerson/problema_teste/contents/problemas.json', {
    method: 'PUT',
    headers: {
      'Authorization': `token ${process.env.GH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: "Atualização automática",
      content: Buffer.from(JSON.stringify(conteudo)).toString('base64'),
      sha: "SHA_DO_ARQUIVO" // Obter via API antes
    })
  });

  return res.status(response.status).json(await response.json());
}
