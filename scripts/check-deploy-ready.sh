#!/bin/bash

# Скрипт для проверки готовности проекта к деплою на GitHub Pages

echo "🔍 Проверка готовности к деплою на GitHub Pages..."
echo ""

# Проверка 1: Git репозиторий
if [ -d .git ]; then
  echo "✅ Git репозиторий инициализирован"
else
  echo "❌ Git репозиторий не инициализирован"
  echo "   Выполните: git init"
  exit 1
fi

# Проверка 2: Remote репозиторий
REMOTE=$(git remote get-url origin 2>/dev/null)
if [ -n "$REMOTE" ]; then
  echo "✅ Remote репозиторий настроен: $REMOTE"

  # Извлечение названия репозитория
  REPO_NAME=$(echo $REMOTE | sed -n 's/.*\/\([^/]*\)\.git/\1/p')
  if [ -z "$REPO_NAME" ]; then
    REPO_NAME=$(echo $REMOTE | sed -n 's/.*\/\([^/]*\)$/\1/p')
  fi

  USERNAME=$(echo $REMOTE | sed -n 's/.*[:/]\([^/]*\)\/.*/\1/p')

  echo "   Username: $USERNAME"
  echo "   Repository: $REPO_NAME"

  # Проверка base в vite.config.ts
  if [ "$REPO_NAME" != "$USERNAME.github.io" ]; then
    echo ""
    echo "⚠️  ВАЖНО: Ваш репозиторий называется '$REPO_NAME'"
    echo "   Убедитесь, что в vite.config.ts указан правильный base:"
    echo "   base: '/$REPO_NAME/',"
    echo ""
    echo "   Ваш сайт будет доступен по адресу:"
    echo "   https://$USERNAME.github.io/$REPO_NAME/"
  else
    echo ""
    echo "   Ваш сайт будет доступен по адресу:"
    echo "   https://$USERNAME.github.io/"
  fi
else
  echo "❌ Remote репозиторий не настроен"
  echo "   Выполните: git remote add origin https://github.com/USERNAME/REPO.git"
  exit 1
fi

echo ""

# Проверка 3: GitHub Actions workflow
if [ -f .github/workflows/deploy.yml ]; then
  echo "✅ GitHub Actions workflow настроен"
else
  echo "❌ GitHub Actions workflow не найден"
  exit 1
fi

echo ""

# Проверка 4: Есть ли изменения для коммита
if [[ -z $(git status -s) ]]; then
  echo "✅ Нет незакоммиченных изменений"
else
  echo "⚠️  Есть незакоммиченные изменения:"
  git status -s
  echo ""
  echo "   Закоммитьте изменения перед деплоем:"
  echo "   git add ."
  echo "   git commit -m 'Your message'"
fi

echo ""

# Проверка 5: Тестовая сборка
echo "🔨 Выполняю тестовую сборку..."
if pnpm build; then
  echo "✅ Сборка успешна"
  echo ""
  echo "📦 Размер собранных файлов:"
  du -sh dist/
else
  echo "❌ Ошибка при сборке"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Проект готов к деплою!"
echo ""
echo "Следующие шаги:"
echo "1. git add ."
echo "2. git commit -m 'Ready for deployment'"
echo "3. git push origin main"
echo ""
echo "После push перейдите на GitHub:"
echo "- Settings → Pages → Source: GitHub Actions"
echo "- Actions → Следите за статусом деплоя"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

