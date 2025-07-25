// Validation Class
class Validator {
  static validateTaskData(data) {
    const errors = []


    if (data.dueDate) {
      const date = new Date(data.dueDate)
      if (isNaN(date.getTime())) {
        errors.push("Invalid due date format")
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateId(id) {
    return typeof id === "string" && id.length > 0
  }

  static sanitizeInput(input) {
    if (typeof input !== "string") return input
    return input.trim().replace(/[<>]/g, "")
  }
}

module.exports = Validator