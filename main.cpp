#include <bits/stdc++.h>  
using namespace std;

const int INF = 1e9;
int rows = 10, cols = 10;

// Directions (Up, Down, Left, Right)
int dr[] = {-1, 1, 0, 0};
int dc[] = {0, 0, -1, 1};

struct Node {
    int r, c, dist;
    bool operator>(const Node& other) const {
        return dist > other.dist;
    }
};

bool valid(int r, int c, vector<vector<int>>& grid) {
    return r >= 0 && c >= 0 && r < rows && c < cols && grid[r][c] == 0;
}

int main() {
    srand(time(0));
    vector<vector<int>> grid(rows, vector<int>(cols, 0));

    // Random obstacles
    for (int i = 0; i < rows * cols / 4; i++) {
        grid[rand() % rows][rand() % cols] = 1;
    }

    // Write maze to file
    ofstream mazeOut("maze.json");
    mazeOut << "[\n";
    for (int i = 0; i < rows; i++) {
        mazeOut << "  [";
        for (int j = 0; j < cols; j++) {
            mazeOut << grid[i][j];
            if (j < cols - 1) mazeOut << ",";
        }
        mazeOut << "]";
        if (i < rows - 1) mazeOut << ",";
        mazeOut << "\n";
    }
    mazeOut << "]";
    mazeOut.close();

    pair<int, int> start = {0, 0}, end = {rows - 1, cols - 1};

    // Dijkstra's Algorithm
    vector<vector<int>> dist(rows, vector<int>(cols, INF));
    vector<vector<pair<int, int>>> parent(rows, vector<pair<int, int>>(cols, {-1, -1}));
    priority_queue<Node, vector<Node>, greater<Node>> pq;

    pq.push({start.first, start.second, 0});
    dist[start.first][start.second] = 0;

    while (!pq.empty()) {
        Node current = pq.top();
        pq.pop();
        int r = current.r;
        int c = current.c;
        int d = current.dist;

        if (make_pair(r, c) == end) break;

        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (valid(nr, nc, grid) && d + 1 < dist[nr][nc]) {
                dist[nr][nc] = d + 1;
                parent[nr][nc] = {r, c};
                pq.push({nr, nc, d + 1});
            }
        }
    }


    // Reconstruct path
    vector<pair<int, int>> path;
    for (auto at = end; at != make_pair(-1, -1); at = parent[at.first][at.second]) {
        path.push_back(at);
    }
    reverse(path.begin(), path.end());

    // Output shortest path to JSON
    ofstream out("shortest_path.json");
    out << "[\n";
    for (size_t i = 0; i < path.size(); i++) {
        out << "  [" << path[i].first << "," << path[i].second << "]";
        if (i < path.size() - 1) out << ",";
        out << "\n";
    }
    out << "]";
    out.close();

    cout << "Shortest path saved to shortest_path.json\n";
    return 0;
}
