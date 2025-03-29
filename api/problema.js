// api/problema.js
const fetch = require('node-fetch');

export default async (req, res) => {
  // 1. Validação
  const { problema, descricao } = JSON.parse(req.body);
  if (!problema || !descricao) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  // 2. Configuração do GitHub
  const GH_TOKEN = process.env.GH_TOKEN;
  const repoOwner = "tiemerson";
  const repoName = "problema_teste";
  const filePath = "problemas.json";

  try {
    // 3. Busca o JSON atual
    const fileRes = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: { Authorization: `token ${GH_TOKEN}` }
      }
    );
    
    const { content, sha } = await fileRes.json();
    const problemas = JSON.parse(Buffer.from(content, 'base64').toString());

    // 4. Adiciona novo problema
    problemas.push({ 
      titulo: problema, 
      descricao,
      data: new Date().toISOString() 
    });

    // 5. Atualiza o arquivo
    const updateRes = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GH_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Problema adicionado: ${problema}`,
          content: Buffer.from(JSON.stringify(problemas, null, 2)).toString('base64'),
          sha
        })
      }
    );

    if (!updateRes.ok) throw new Error(await updateRes.text());
    res.status(200).json({ success: true });

  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar: " + error.message });
  }
};
