//
//  MainViewController.swift
//  Chiisai
//
//  Created by Thor on 12/05/2019.
//  Copyright © 2019 thor. All rights reserved.
//

import Cocoa
import AVKit
import AVFoundation

class MainViewController: NSViewController {
    @IBOutlet weak var mainPlayer: AVPlayerView!
    @IBOutlet var searchField: NSSearchField!
    @IBOutlet weak var indicator: NSProgressIndicator!
    @IBOutlet weak var indicatorText: NSTextField!
    @IBOutlet var hiddenPanel: NSView!
    @IBOutlet weak var currentPlayingTitle: NSTextField!
    @IBOutlet weak var currentPlayingAuthor: NSTextField!
    @IBOutlet weak var currentSource: NSTextField!
    @IBOutlet var tableView: NSTableView!
    
    let rpc = SwordRPC(appId: DISCORD_APPID)
    var data: [SearchResult] = []
    
    @IBAction func quitButton(_ sender: Any) {
        NSApplication.shared.terminate(self)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self
        tableView.rowHeight = CGFloat(52.0)
        tableView.target = self
        tableView.doubleAction = #selector(tableViewDoubleClick(_:))
        // Do view setup here.
        // getTrendingYT()
        hiddenPanelController()
        rpc.connect()
    }
    
    
    func hiddenPanelController() {
        let area = NSTrackingArea.init(rect: mainPlayer.bounds, options: [NSTrackingArea.Options.mouseEnteredAndExited, NSTrackingArea.Options.activeAlways], owner: self, userInfo: nil)
        mainPlayer.addTrackingArea(area)
        
    }
    
    override func mouseEntered(with: NSEvent) {
        hiddenPanel.isHidden = true
    }
    
    override func mouseExited(with: NSEvent) {
        hiddenPanel.isHidden = false
    }
    
    func manipulateResponse(r: Any) {
        if r is SearchList {
            let s = (r as! SearchList).items as [SearchResult]
            data = s
            self.tableView.reloadData()
        } else if r is VideoList {
            
        }
        
    }
    
    func reAdjustFrameForDirectURL()
    {
        self.tableView.isHidden = true
    }
    
    func reAdjustFrameForTableView()
    {
        self.tableView.isHidden = false
    }

    
    func getTrendingYT() {
        indicator.startAnimation(nil)
        indicatorText.stringValue = "LOADING"
        let request = VideoListRequest(part: [.id, .statistics, .snippet], filter: .chart)
        
        ApiSession.shared.send(request) { result in
            switch result {
            case .success(let response):
                //print(response)
                self.indicator.stopAnimation(nil)
                self.indicatorText.stringValue = ""
                self.manipulateResponse(r: response)
            case .failed(let error):
                print(error)
                self.indicator.stopAnimation(nil)
                self.indicatorText.stringValue = ">_<"
            }
        }
    }
    
    func searchYT(query: String) {
        reAdjustFrameForTableView()
        indicator.startAnimation(nil)
        indicatorText.stringValue = "LOADING"
        let request = SearchListRequest(part: [.snippet], maxResults: 10, searchQuery: query)
        
        ApiSession.shared.send(request) { result in
            switch result {
            case .success(let response):
                //print(response)
                self.indicator.stopAnimation(nil)
                self.indicatorText.stringValue = ""
                self.manipulateResponse(r: response)
            case .failed(let error):
                print(error)
                self.indicator.stopAnimation(nil)
                self.indicatorText.stringValue = ">_<"
            }
        }
    }
    
    func directYTURL (url: String)
    {
        print("Detected youtube URL! ><")
        self.mainPlayer.player = nil;
        reAdjustFrameForDirectURL()
        indicator.startAnimation(nil)
        indicatorText.stringValue = "LOADING DIRECT URL"
        let y = Sakura()
        y.extractInfo(for: .urlString(url), success: {
            info in
            
            self.currentPlayingTitle.stringValue = "Playing from YouTube URL"
            self.currentPlayingAuthor.stringValue = "DirectYTURL"
            
            self.indicatorText.stringValue = "LOADING DISCORD RPC"
            
            self.updateRPC(details: "Listening to YouTube", state: url)
            
            var urlString = ""
            if let hiq = info.highestQualityPlayableLink {
                urlString = hiq
                let url = URL(string: urlString)
                
                let player = AVPlayer(url: url!)
                self.mainPlayer.player = player
                
                self.mainPlayer.player!.play()
                self.indicator.stopAnimation(nil)
                self.indicatorText.stringValue = ""
            } else {
                self.handlePlayBackError(e: "corruptedURL")
            }
            
        }) { error in
            print(error)
            self.indicator.stopAnimation(nil)
            self.indicatorText.stringValue = ""
            self.currentPlayingTitle.stringValue = "I can't play it! >_<"
            self.currentPlayingAuthor.stringValue = "ERROR: \(error)"
        }
    }
    
    // Let's not give a shit about the trending videos
    @IBAction func searchAct(sender: NSSearchField) {
        print(sender.stringValue)
        if sender.stringValue.hasPrefix("https://www.youtube.com/watch?v="){
            directYTURL(url: sender.stringValue)
        } else if sender.stringValue != "" {
            searchYT(query: sender.stringValue)
        } else {
            // Maybe not do a shit?
            /*if self.mainPlayer.player != nil {
                self.mainPlayer.player = nil
                self.currentPlayingTitle.stringValue = "Not playing"
                self.currentPlayingAuthor.stringValue = "Please search for music first (or add YouTube link)"
            }*/
        }
        
    }
    
    func stopPlayer()
    {
        if self.mainPlayer.player != nil {
         self.mainPlayer.player = nil
         self.currentPlayingTitle.stringValue = "Not playing"
         self.currentPlayingAuthor.stringValue = "Please search for music first (or add YouTube link)"
         }
    }
    
    @objc func tableViewDoubleClick(_ sender:AnyObject) {
        self.mainPlayer.player = nil;
        
        indicator.startAnimation(nil)
        indicatorText.stringValue = "LOADING VIDEO"
        
        let item = data[tableView.selectedRow]
        // Just to check if this fucker works.
        guard let vID = item.id.videoID  else { return }
        
        let y = Sakura()
        y.extractInfo(for: .urlString("https://www.youtube.com/watch?v=\(vID)"), success: {
            info in
            
            self.currentPlayingTitle.stringValue = item.snippet.title
            self.currentPlayingAuthor.stringValue = item.snippet.channelTitle
            
            self.indicatorText.stringValue = "LOADING DISCORD RPC"
            
            
            var urlString = ""
            if let hiq = info.highestQualityPlayableLink {
                urlString = hiq
                let url = URL(string: urlString)
                
                let player = AVPlayer(url: url!)
                self.mainPlayer.player = player
                
                self.mainPlayer.player!.play()
                self.indicator.stopAnimation(nil)
                self.indicatorText.stringValue = ""
                            self.updateRPC(details: item.snippet.title, state: item.snippet.channelTitle)
            } else {
                self.handlePlayBackError(e: "corruptedURL")
            }
        
        }) { error in
            print(error)
            self.indicator.stopAnimation(nil)
            self.indicatorText.stringValue = ""
            self.currentPlayingTitle.stringValue = "I can't play it! >_<"
            self.currentPlayingAuthor.stringValue = "ERROR: \(error)"
        }
        
    }
    
    func updateRPC(details: String, state: String)
    {
        var presence = RichPresence()
        presence.details = details
        presence.state = state
        presence.timestamps.start = Date()
        presence.assets.largeImage = "rikka3x"
        self.rpc.setPresence(presence)
    }
    
    func handlePlayBackError(e: String){
        print(e)
        self.indicator.stopAnimation(nil)
        self.indicatorText.stringValue = ""
        self.currentPlayingTitle.stringValue = "I can't play it! >_<"
        self.currentPlayingAuthor.stringValue = "ERROR: \(e)"
    }
    
    
    
    
}



extension MainViewController: NSTableViewDataSource, NSTableViewDelegate{
    static func freshController() -> MainViewController {
        let storyboard = NSStoryboard(name: NSStoryboard.Name("Main"), bundle: nil)
        let identifier = NSStoryboard.SceneIdentifier("MainViewController")
        guard let viewcontroller = storyboard.instantiateController(withIdentifier: identifier) as? MainViewController else {
            fatalError("Something terrible happened! ><")
        }
        return viewcontroller
    }
    
    
    func numberOfRows(in tableView: NSTableView) -> Int {
        return data.count
    }
    
    public enum CellIdentifiers {
        static let TitleCell = "TitleCellID"
        static let DurationCell = "DurationCellID"
        static let DateCell = "DateCellID"
    }
    
    func tableView(_ tableView: NSTableView, viewFor tableColumn: NSTableColumn?, row: Int) -> NSView? {
        var image: NSImage?
        var text: String = ""
        //var authorText: String = ""
        var cellIdentifier: String = ""
        
        
        let item = data[row]
        
        if tableColumn == tableView.tableColumns[0] {
            let _thmburl = URL(string: item.snippet.thumbnails.default.url!)
            let _thmbdata = try? Data(contentsOf: _thmburl!)
            
            image = NSImage(data: ((_thmbdata ?? nil) ?? nil)!) ?? nil
            text = item.snippet.title
            //authorText = item.snippet.channelTitle
            cellIdentifier = CellIdentifiers.TitleCell
        }
    
        if let cell = tableView.makeView(withIdentifier: NSUserInterfaceItemIdentifier(rawValue: cellIdentifier), owner: nil) as? NSTableCellView {
            cell.textField?.stringValue = text
            cell.imageView?.image = image ?? nil
            return cell
        }
        
        return nil
    }
    
    func tableViewSelectionDidChange(_ notification: Notification) {
        
    }

}
