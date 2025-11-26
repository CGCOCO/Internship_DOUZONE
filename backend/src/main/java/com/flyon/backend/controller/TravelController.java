package com.flyon.backend.controller;

import com.flyon.backend.dto.TravelIndexDto;
import com.flyon.backend.service.TravelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/travel")
@CrossOrigin(origins = "*")   // ★ 임시로 CORS 추가 //*이 위험함. 도메인을 넣어서 특정해서 받기.꼭 바꾸기!!
public class TravelController {

    private final TravelService travelService;

    @GetMapping("/exchange")
    public ResponseEntity<?> getExchange(@RequestParam String country) {
        return ResponseEntity.ok(travelService.getExchangeRate(country));
    }

    @GetMapping("/index")
    public ResponseEntity<TravelIndexDto> getTravelIndex(@RequestParam String country) {
        return ResponseEntity.ok(travelService.getTravelIndex(country));
    }
}


/*package com.flyon.backend.controller;

import com.flyon.backend.dto.*;
import com.flyon.backend.service.TravelService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/travel")
@CrossOrigin("*") // 프론트와 백엔드 포트 달라 CORS 허용 //모든 port 배포했을 때 주소가 노출되어서 -> 보안적인 문제
//*이 위험함. 도메인을 넣어서 특정해서 받기.꼭 바꾸기!!
public class TravelController {

    //Resource //의존성 주입-> 생성자 없이 사용 가능
    private final TravelService travelService; //bean -> bean 생성을 왜 하는지 검색 후 수정 annotation

    public TravelController(TravelService travelService) {
        this.travelService = travelService;
    }

    @GetMapping("/exchange")
    public ExchangeDto getExchange(@RequestParam String country) {
        return travelService.getExchangeRate(country);
    }

    // 출국자 엔드포인트 (정확한 위치!) //칭찬 받음!! -> 환율, 출국자 각각의 controller로!! 나머지 service에서(수정X)
    @GetMapping("/outbound")
    public OutboundDto getOutbound(@RequestParam String country) {
        return travelService.getOutboundRate(country);
    }

    @GetMapping("/index")
    public TravelIndexDto getTravelIndex(@RequestParam String country) {
        return travelService.getTravelIndex(country);
    }



}
*/