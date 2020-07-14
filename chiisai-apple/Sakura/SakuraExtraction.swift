//
//  SakuraExtraction.swift
//  Chiisai
//
//  Created by Thor on 13/05/2019.
//  Copyright © 2019 thor. All rights reserved.
//

import Foundation

public enum SakuraExtraction {
    case url(URL)
    case urlString(String)
    case id(String)
    
    var videoId: String? {
        switch self {
            
        case .url(let url):
            return videoId(from: url)
            
        case .urlString(let string):
            guard let url = URL(string: string) else {
                return nil
            }
            return videoId(from: url)
            
        case .id(let videoId):
            return videoId
        }
    }
    
    private func videoId(from url: URL) -> String? {
        guard let host = url.host else {
            return nil
        }
        
        let components = url.pathComponents
        
        switch host {
            
        case _ where host.contains("youtu.be"):
            return components[safe: 1]
            
        case _ where host.contains("m.youtube.com"):
            return url.absoluteString.components(separatedBy: "?").last?.queryComponents()["v"]
            
        case _ where host.contains("youtube.com")
            && components[safe: 1] == "embed":
            return components[safe: 2]
            
        case _ where host.contains("youtube.com")
            && components[safe: 1] != "embed":
            return url.query?.queryComponents()["v"]
            
        default:
            return nil
        }
    }
}
