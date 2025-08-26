// Logger utility with different log levels
class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development'
    this.isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production'
    
    // Set log level based on environment
    this.logLevel = this.isDevelopment ? 'debug' : 'info'
    
    // Log levels in order of priority
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    }
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.logLevel]
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (data) {
      return `${prefix} ${message}`, data
    }
    return `${prefix} ${message}`
  }

  error(message, data = null) {
    if (this.shouldLog('error')) {
      if (data) {
        console.error(this.formatMessage('error', message), data)
      } else {
        console.error(this.formatMessage('error', message))
      }
    }
  }

  warn(message, data = null) {
    if (this.shouldLog('warn')) {
      if (data) {
        console.warn(this.formatMessage('warn', message), data)
      } else {
        console.warn(this.formatMessage('warn', message))
      }
    }
  }

  info(message, data = null) {
    if (this.shouldLog('info')) {
      if (data) {
        console.info(this.formatMessage('info', message), data)
      } else {
        console.info(this.formatMessage('info', message))
      }
    }
  }

  debug(message, data = null) {
    if (this.shouldLog('debug')) {
      if (data) {
        console.debug(this.formatMessage('debug', message), data)
      } else {
        console.debug(this.formatMessage('debug', message))
      }
    }
  }

  // Special method for API service logging
  api(message, data = null) {
    if (this.shouldLog('debug')) {
      const apiMessage = `[API] ${message}`
      if (data) {
        console.debug(this.formatMessage('debug', apiMessage), data)
      } else {
        console.debug(this.formatMessage('debug', apiMessage))
      }
    }
  }
}

// Create singleton instance
const logger = new Logger()

export default logger
