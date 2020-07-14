//  Sakura code is forked from YouTubeDirectExtractor
//
//  Sakura.swift
//  Chiisai
//
//  Created by Thor on 13/05/2019.
//  Copyright © 2019 thor. All rights reserved.
//

import Foundation

public class Sakura {
    
    private let infoBasePrefix = "https://www.youtube.com/get_video_info?video_id="
    private let userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6"
    
    // MARK: - Public
    
    public init() {
    }
    
    public func extractInfo(for source: SakuraExtraction,
                            success: @escaping (SakuraInfo) -> Void,
                            failure: @escaping (Swift.Error) -> Void) {
        
        extractRawInfo(for: source) { info, error in
            
            if let error = error {
                failure(error)
                return
            }
            
            guard info.count > 0 else {
                failure(SakuraError.unkown)
                return
            }
            
            success(SakuraInfo(rawInfo: info))
        }
    }
    
    // MARK: - Internal
    
    func extractRawInfo(for source: SakuraExtraction,
                        completion: @escaping ([[String: String]], Swift.Error?) -> Void) {
        
        guard let id = source.videoId else {
            completion([], SakuraError.cantExtractVideoId)
            return
        }
        
        guard let infoUrl = URL(string: "\(infoBasePrefix)\(id)") else {
            completion([], SakuraError.cantConstructRequestUrl)
            return
        }
        
        let r = NSMutableURLRequest(url: infoUrl)
        r.httpMethod = "GET"
        r.setValue(userAgent, forHTTPHeaderField: "User-Agent")
        
        URLSession.shared.dataTask(with: r as URLRequest) { data, response, error in
            
            guard let data = data else {
                completion([], error ?? SakuraError.noDataInResponse)
                return
            }
            
            guard let dataString = String(data: data, encoding: .utf8) else {
                completion([], SakuraError.cantConvertDataToString)
                return
            }
            
            let extractionResult = self.extractInfo(from: dataString)
            completion(extractionResult.0, extractionResult.1)
            
            }.resume()
    }
    
    func extractInfo(from string: String) -> ([[String: String]], Swift.Error?) {
        let pairs = string.queryComponents()
        
        guard let fmtStreamMap = pairs["url_encoded_fmt_stream_map"],
            !fmtStreamMap.isEmpty else {
                let error = YoutubeError(errorDescription: pairs["reason"])
                return ([], error ?? SakuraError.cantExtractFmtStreamMap)
        }
        
        let fmtStreamMapComponents = fmtStreamMap.components(separatedBy: ",")
        
        let infoPerPreset = fmtStreamMapComponents.map { $0.queryComponents() }
        return (infoPerPreset, nil)
    }
}
