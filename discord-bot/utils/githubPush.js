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
  githubRepo
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

    // IMPORTANTE: Também atualizar em /docs para GitHub Pages
    const docsPath = path.join(localRepoPath, 'docs', 'pilotos.json');
    fs.writeFileSync(docsPath, JSON.stringify(jsonData, null, 2));
    console.log(`✅ JSON também salvo em: docs/pilotos.json`);

    // Git add - adicionar ambos os arquivos
    await git.add(filePath);
    await git.add('docs/pilotos.json');
    console.log(`✅ Ambos os arquivos adicionados ao git`);

    // Git commit
    const timestamp = new Date().toLocaleString('pt-BR');
    await git.commit(`🤖 Atualização automática de pilotos - ${timestamp}`);
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
