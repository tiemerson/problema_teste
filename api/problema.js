// api/problema.js (Deploy no Vercel/Netlify)
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { problema, descricao } = req.body;

  // 1. Validação
  if (!problema || !descricao) {
    return res.status(400).json({ error: "Campos obrigatórios faltando!" });
  }

  // 2. Configuração do GitHub
  const GH_TOKEN = process.env.GH_TOKEN; // Variável de ambiente (segura)
  const repoOwner = "tiemerson";
  const repoName = "problema_teste";
  const filePath = "problemas.json";

  try {
    // 3. Busca o arquivo atual
    const fileResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: { Authorization: `token ${GH_TOKEN}` }
      }
    );
    
    const fileData = await fileResponse.json();
    const problemas = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

    // 4. Adiciona o novo problema
    problemas.push({ titulo: problema, descricao });

    // 5. Atualiza o arquivo no GitHub
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GH_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Adicionando problema via API",
          content: Buffer.from(JSON.stringify(problemas, null, 2)).toString('base64'),
          sha: fileData.sha
        })
      }
    );

    if (!updateResponse.ok) throw new Error("Falha ao atualizar JSON");
    res.status(200).json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
