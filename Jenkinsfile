// Jenkins declarative pipeline: runs the API and BDD UI suites inside Microsoft's Playwright image
// and publishes JUnit results and the HTML report for every build.
pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.56.1-noble'
      args '--ipc=host'
    }
  }

  parameters {
    choice(name: 'SUITE', choices: ['all', 'smoke', 'api'], description: 'Which tests to run')
  }

  environment {
    CI = 'true'
    HOME = "${env.WORKSPACE}"
  }

  options {
    timeout(time: 20, unit: 'MINUTES')
    timestamps()
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Generate BDD specs and typecheck') {
      steps {
        sh 'npm run typecheck'
      }
    }

    stage('Test') {
      steps {
        script {
          def cmd = [all: 'npm test', smoke: 'npm run test:smoke', api: 'npm run test:api'][params.SUITE]
          sh cmd
        }
      }
    }
  }

  post {
    always {
      junit testResults: 'reports/junit.xml', allowEmptyResults: true
      archiveArtifacts artifacts: 'reports/html/**, test-results/**', allowEmptyArchive: true
    }
  }
}
