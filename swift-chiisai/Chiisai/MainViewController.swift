//
//  MainViewController.swift
//  Chiisai
//
//  Created by Thoralf Thelle on 12/05/2019.
//  Copyright © 2019 thor. All rights reserved.
//

import Cocoa
import AVKit

class MainViewController: NSViewController {
    @IBOutlet weak var scrollView: NSScrollView!
    @IBOutlet weak var player: AVPlayerView!
    @IBOutlet var searchField: NSSearchField!
    @IBOutlet weak var indicator: NSProgressIndicator!
    @IBOutlet weak var indicatorText: NSTextField!
    @IBOutlet var hiddenPanel: NSView!
    @IBOutlet weak var currentPlayingTitle: NSTextField!
    @IBOutlet weak var currentPlayingAuthor: NSTextField!
    @IBOutlet weak var currentSource: NSTextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do view setup here.
        getTrendingYT()
        hiddenPanelController()
    }
    
    func hiddenPanelController() {
        let area = NSTrackingArea.init(rect: player.bounds, options: [NSTrackingArea.Options.mouseEnteredAndExited, NSTrackingArea.Options.activeAlways], owner: self, userInfo: nil)
        player.addTrackingArea(area)
        
    }
    
    override func mouseEntered(with: NSEvent) {
        hiddenPanel.isHidden = true
    }
    
    override func mouseExited(with: NSEvent) {
        hiddenPanel.isHidden = false
    }
    
    func appendDataToScrollView(data: VideoList){
        let subviewFrame = CGRect(origin: .zero,
                                  size: CGSize(width: 320, height: 640 * 4))
        let gradient = CAGradientLayer()
        gradient.colors = [
            NSColor.blue.withAlphaComponent(0.2).cgColor,
            NSColor.blue.withAlphaComponent(0.4).cgColor
        ]
        gradient.frame = subviewFrame
        let documentView = NSView(frame: subviewFrame)
        
        documentView.wantsLayer = true
        documentView.layer?.addSublayer(gradient)
        
        let scrollViewFrame = CGRect(origin: .zero,
                                     size: CGSize(width: 320, height: 640))
        let scrollView = NSScrollView(frame: scrollViewFrame)
        scrollView.documentView = documentView
        scrollView.contentView.scroll(to: CGPoint(x: 0, y: subviewFrame.size.height))
    }
    
    func getTrendingYT() {
        indicator.startAnimation(nil)
        indicatorText.stringValue = "Loading"
        let request = VideoListRequest(part: [.id, .statistics], filter: .chart)
        
        ApiSession.shared.send(request) { result in
            switch result {
            case .success(let response):
                print(response)
                self.indicator.stopAnimation(nil)
                self.indicatorText.stringValue = ""
                self.appendDataToScrollView(data: response)
            case .failed(let error):
                print(error)
                self.indicator.stopAnimation(nil)
                self.indicatorText.stringValue = ">_<"
            }
        }
    }
    
    func searchYT(query: String) {
        indicator.startAnimation(nil)
        indicatorText.stringValue = "Loading"
        let request = SearchListRequest(part: [.snippet], searchQuery: query)
        
        ApiSession.shared.send(request) { result in
            switch result {
            case .success(let response):
                print(response)
                self.indicator.stopAnimation(nil)
                 self.indicatorText.stringValue = ""
            case .failed(let error):
                print(error)
                self.indicator.stopAnimation(nil)
                self.indicatorText.stringValue = ">_<"
            }
        }
    }
    
    @IBAction func searchAct(sender: NSSearchField) {
        print(sender.stringValue)
        switch sender.stringValue {
        case "":
            getTrendingYT()
        case " ":
            getTrendingYT()
        default:
            searchYT(query: sender.stringValue)
        }
        
    }
    
}



extension MainViewController {
    static func freshController() -> MainViewController {
        let storyboard = NSStoryboard(name: NSStoryboard.Name("Main"), bundle: nil)
        let identifier = NSStoryboard.SceneIdentifier("MainViewController")
        guard let viewcontroller = storyboard.instantiateController(withIdentifier: identifier) as? MainViewController else {
            fatalError("Something terrible happened! ><")
        }
        return viewcontroller
    }
}
