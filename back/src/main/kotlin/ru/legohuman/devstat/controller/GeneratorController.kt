package ru.legohuman.devstat.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController
import ru.legohuman.devstat.dto.CountryGenerationRequest
import ru.legohuman.devstat.dto.DataRequestIdentity
import ru.legohuman.devstat.dto.DeveloperGenerationRequest
import ru.legohuman.devstat.service.CountryDataGenerationService
import ru.legohuman.devstat.service.DeveloperDataGenerationService

@Suppress("unused")
@RestController
@RequestMapping("generators")
class GeneratorController @Autowired constructor(
        private val countryDataGenerationService: CountryDataGenerationService,
        private val developerDataGenerationService: DeveloperDataGenerationService
) {
    @RequestMapping(path = ["/countries"], method = [(RequestMethod.PUT)])
    fun generateCountriesData(@RequestBody request: CountryGenerationRequest
    ): ResponseEntity<Array<String>> {
        countryDataGenerationService.generateData(request)
        return ResponseEntity(arrayOf(), HttpStatus.OK)
    }

    @RequestMapping(path = ["/countries"], method = [(RequestMethod.DELETE)])
    fun removeCountriesData(@RequestBody request: DataRequestIdentity): ResponseEntity<Array<String>> {
        countryDataGenerationService.removeData(request)
        return ResponseEntity(arrayOf(), HttpStatus.OK)
    }

    @RequestMapping(path = ["/developers"], method = [(RequestMethod.PUT)])
    fun generateDevelopersData(@RequestBody request: DeveloperGenerationRequest): ResponseEntity<Array<String>> {
        developerDataGenerationService.generateData(request)
        return ResponseEntity(arrayOf(), HttpStatus.OK)
    }

    @RequestMapping(path = ["/developers"], method = [(RequestMethod.DELETE)])
    fun removeDevelopersData(@RequestBody request: DataRequestIdentity): ResponseEntity<Array<String>> {
        developerDataGenerationService.removeData(request)
        return ResponseEntity(arrayOf(), HttpStatus.OK)
    }
}