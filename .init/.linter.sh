#!/bin/bash
cd /home/kavia/workspace/code-generation/ai-requirements-automation-suite-6255-6265/automation_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

