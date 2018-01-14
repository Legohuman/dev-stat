package ru.legohuman.devstat.controller

import com.fasterxml.jackson.databind.node.NullNode
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
class GeneratorController(
        private val countryDataGenerationService: CountryDataGenerationService,
        private val developerDataGenerationService: DeveloperDataGenerationService
) : BaseController() {
    @RequestMapping(path = ["/countries"], method = [(RequestMethod.PUT)])
    fun generateCountriesData(@RequestBody request: CountryGenerationRequest
    ): ResponseEntity<Any> {
        return handleRequestIfValid(request, {
            countryDataGenerationService.generateData(request)
            ResponseEntity(NullNode.instance, HttpStatus.OK)
        })
    }

    @RequestMapping(path = ["/countries"], method = [(RequestMethod.DELETE)])
    fun removeCountriesData(@RequestBody request: DataRequestIdentity): ResponseEntity<Any> {
        return handleRequestIfValid(request, {
            countryDataGenerationService.removeData(request)
            ResponseEntity(NullNode.instance, HttpStatus.OK)
        })
    }

    @RequestMapping(path = ["/developers"], method = [(RequestMethod.PUT)])
    fun generateDevelopersData(@RequestBody request: DeveloperGenerationRequest): ResponseEntity<Any> {
        return handleRequestIfValid(request, {
            developerDataGenerationService.generateData(request)
            ResponseEntity(NullNode.instance, HttpStatus.OK)
        })
    }

    @RequestMapping(path = ["/developers"], method = [(RequestMethod.DELETE)])
    fun removeDevelopersData(@RequestBody request: DataRequestIdentity): ResponseEntity<Any> {
        return handleRequestIfValid(request, {
            developerDataGenerationService.removeData(request)
            ResponseEntity(NullNode.instance, HttpStatus.OK)
        })
    }
}