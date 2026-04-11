import { simpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path';

/**
 * Faz push dos dados para GitHub usando GitHub CLI
 * Requer: GitHub Token, local repo path, arquivo JSON
 */
export async function pushToGitHub(
  jsonData,
  localRepoPath,
  filePath = 'src/data/pilotos.json',
  githubToken,
  githubRepo,
  updateDocs = true // Se true, também atualiza em /docs
) {
  try {
    const git = simpleGit(localRepoPath);

    // Escrever o arquivo JSON
    const fullPath = path.join(localRepoPath, filePath);
    const dir = path.dirname(fullPath);

    // Criar diretório se não existir
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Escrever JSON
    fs.writeFileSync(fullPath, JSON.stringify(jsonData, null, 2));
    console.log(`✅ JSON salvo em: ${filePath}`);

    // Se updateDocs=true, também atualizar em /docs com o mesmo nome de arquivo
    if (updateDocs) {
      const fileName = path.basename(filePath);
      const docsPath = path.join(localRepoPath, 'docs', fileName);
      fs.writeFileSync(docsPath, JSON.stringify(jsonData, null, 2));
      console.log(`✅ JSON também salvo em: docs/${fileName}`);
      
      // Git add ambos
      await git.add(filePath);
      await git.add(`docs/${fileName}`);
    } else {
      await git.add(filePath);
    }

    console.log(`✅ Arquivo${updateDocs ? 's' : ''} adicionado ao git`);

    // Git commit
    const timestamp = new Date().toLocaleString('pt-BR');
    await git.commit(`🤖 Atualização automática - ${timestamp}`);
    console.log(`✅ Commit realizado`);

    // Git push
    await git.push('origin', 'main');
    console.log(`✅ Push realizado ao GitHub!`);

    return { success: true, message: 'Dados atualizados no GitHub com sucesso!' };
  } catch (error) {
    console.error('❌ Erro ao fazer push:', error.message);
    return { success: false, error: error.message };
  }
}
